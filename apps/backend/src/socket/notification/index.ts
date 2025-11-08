import jwt from "jsonwebtoken";
import { Socket, Namespace } from "socket.io";
import { prisma, redisClient } from "@/config";
import { getNamespace } from "@/socket/registry";

export const notificationSocket = (ioNotification: Namespace, socket: Socket) => {
    const token = socket.handshake.auth?.token;
    if (!token) return socket.disconnect(true);

    let userId: string;
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
        userId = decoded.id;
    } catch {
        return socket.disconnect(true);
    }

    socket.join(`user_${userId}`);
    redisClient.set(`user:${userId}:online`, "1", { EX: 60 });

    setupPresenceRooms(socket, userId).then(() => {
        broadcastPresence(ioNotification, userId, true);
    });

    socket.on("ping-online", async () => {
        await redisClient.set(`user:${userId}:online`, "1", { EX: 60 });
    });

    socket.on("disconnect", async () => {
        await redisClient.del(`user:${userId}:online`);
        broadcastPresence(ioNotification, userId, false);
    });
};

async function setupPresenceRooms(socket: Socket, userId: string) {
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

    const chatUsers = await prisma.chat_users.findMany({
        where: { user_id: userId },
        select: { chat_id: true },
    });
    chatUsers.forEach((c) => socket.join(`chat_${c.chat_id}`));

    const servers = await prisma.user_server.findMany({
        where: { user_id: userId },
        select: { server_id: true },
    });
    servers.forEach((s) => socket.join(`server_${s.server_id}`));
}

async function broadcastPresence(ioNotification: Namespace, userId: string, isOnline: boolean) {
    const payload = { userId, isOnline };

    ioNotification
        .to(`friends_of_${userId}`)
        .emit(isOnline ? "user-online" : "user-offline", payload);

    const chatUsers = await prisma.chat_users.findMany({
        where: { user_id: userId },
        select: { chat_id: true },
    });
    chatUsers.forEach((c) =>
        ioNotification
            .to(`chat_${c.chat_id}`)
            .emit(isOnline ? "user-online" : "user-offline", payload)
    );

    const servers = await prisma.user_server.findMany({
        where: { user_id: userId },
        select: { server_id: true },
    });
    servers.forEach((s) =>
        ioNotification
            .to(`server_${s.server_id}`)
            .emit(isOnline ? "user-online" : "user-offline", payload)
    );
}

export const emitNotification = (userId: string, data: any) => {
    const ioNotification: Namespace = getNamespace("notification");
    ioNotification.to(`user_${userId}`).emit("notification", data);
};
