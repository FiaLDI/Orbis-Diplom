import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { ioNotification } from "@/server";
import { prisma, redisClient } from "@/config";

export const notificationSocket = (socket: Socket) => {
  console.log(`🔔 Notification connected: ${socket.id}`);

  const token = socket.handshake.auth?.token;
  if (!token) {
    socket.disconnect(true);
    return;
  }

  let userId: number;

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
    userId = decoded.id;
  } catch {
    console.log(`❌ Invalid token for ${socket.id}`);
    socket.disconnect(true);
    return;
  }

  socket.join(`user_${userId}`);

  redisClient.set(`user:${userId}:online`, "1", { EX: 60 });


  console.log(`👤 User ${userId} joined room user_${userId}`);

  // ✅ Подключаем к комнатам друзей, собеседников и серверов
  setupPresenceRooms(socket, userId).then(() => {
    broadcastPresence(userId, true);
  });

  // ♻️ обновление TTL
  socket.on("ping-online", async () => {
    await redisClient.set(`user:${userId}:online`, "1", { EX: 60 });
    });

    

  socket.on("disconnect", async () => {
    console.log(`🔴 Notification socket disconnected: ${socket.id} (user ${userId})`);
    await redisClient.del(`user:${userId}:online`);
    broadcastPresence(userId, false);
  });
};

// 📡 вспомогательная функция
async function setupPresenceRooms(socket: Socket, userId: number) {
  // 1️⃣ друзья
  const friends = await prisma.friend_requests.findMany({
    where: {
      status: "accepted",
      OR: [{ from_user_id: userId }, { to_user_id: userId }],
    },
    select: { from_user_id: true, to_user_id: true },
  });

  friends.forEach((fr) => {
    const friendId = fr.from_user_id === userId ? fr.to_user_id : fr.from_user_id;
    socket.join(`friends_of_${friendId}`);
  });

  // 2️⃣ чаты, где участвует
  const chatUsers = await prisma.chat_users.findMany({
    where: { user_id: userId },
    select: { chat_id: true },
  });

  chatUsers.forEach((c) => {
    socket.join(`chat_${c.chat_id}`);
  });

  // 3️⃣ серверы, где участвует
  const servers = await prisma.user_server.findMany({
    where: { user_id: userId },
    select: { server_id: true },
  });

  servers.forEach((s) => {
    socket.join(`server_${s.server_id}`);
  });
}

// 🚀 Рассылка статуса
async function broadcastPresence(userId: number, isOnline: boolean) {
  const payload = { userId, isOnline };

  // всем друзьям
  ioNotification.to(`friends_of_${userId}`).emit(
    isOnline ? "user-online" : "user-offline",
    payload
  );

  // всем собеседникам по чатам
  const chatUsers = await prisma.chat_users.findMany({
    where: { user_id: userId },
    select: { chat_id: true },
  });
  chatUsers.forEach((c) => {
    ioNotification.to(`chat_${c.chat_id}`).emit(
      isOnline ? "user-online" : "user-offline",
      payload
    );
  });

  // всем на общих серверах
  const servers = await prisma.user_server.findMany({
    where: { user_id: userId },
    select: { server_id: true },
  });
  servers.forEach((s) => {
    ioNotification.to(`server_${s.server_id}`).emit(
      isOnline ? "user-online" : "user-offline",
      payload
    );
  });
}


// 🔔 рассылка уведомлений
export const emitNotification = (userId: number, data: any) => {
  ioNotification.to(`user_${userId}`).emit("notification", data);
};
