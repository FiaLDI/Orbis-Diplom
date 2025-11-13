import jwt from "jsonwebtoken";
import { Socket, Namespace } from "socket.io";
import { redisClient } from "@/config";

export const journalSocket = (ioJournal: Namespace, socket: Socket) => {
  // 🟢 Подключение
  console.log(`🔌 [SOCKET] Новое подключение: ${socket.id}`);

  try {
    const token = socket.handshake.auth?.token;
    const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    if (decoded?.id) {
      socket.join(`user:${decoded.id}`);
      socket.data.userId = decoded.id;
      console.log(`✅ [AUTH] Пользователь авторизован: ${decoded.id}`);
    } else {
      console.warn("⚠️ [AUTH] Токен без ID");
    }
  } catch (err) {
    console.warn("❌ [AUTH] Ошибка проверки токена:", (err as any).message);
  }

  // 🟠 Установка статуса
  socket.on("set-status", async (userId: string, status: string) => {
    await redisClient.set(`user:${userId}:${status}`, "true");
    socket.broadcast.emit("user-online", userId);
    console.log(`💬 [STATUS] Пользователь ${userId} → ${status}`);
  });

  // 🟡 Подключение к серверу
  socket.on("join-server", (serverId: string) => {
    socket.join(`server:${serverId}`);
    console.log(`📡 [JOIN] Пользователь ${socket.data.userId} вошёл в room server:${serverId}`);
  });

  socket.on("leave-server", (serverId: string) => {
    socket.leave(`server:${serverId}`);
    console.log(`🚪 [LEAVE] Пользователь ${socket.data.userId} покинул room server:${serverId}`);
  });

  // 🧩 Унифицированная система обновлений
  socket.on("server-update", (type: string, payload: { serverId: string; issueId?: string }) => {
    const { serverId, issueId } = payload;
    const room = `server:${serverId}`;

    console.log(`🛰️ [UPDATE] Тип="${type}" Сервер=${serverId}${issueId ? ` Issue=${issueId}` : ""}`);

    switch (type) {
      case "settings":
        ioJournal.to(room).emit("server:update:settings", payload);
        console.log(`⚙️  → Отправлено событие [server:update:settings] в ${room}`);
        break;
      case "moderation":
        ioJournal.to(room).emit("server:update:moderation", payload);
        console.log(`🧑‍⚖️ → Отправлено событие [server:update:moderation] в ${room}`);
        break;
      case "chats":
        ioJournal.to(room).emit("server:update:chats", payload);
        console.log(`💬 → Отправлено событие [server:update:chats] в ${room}`);
        break;
      case "projects":
        ioJournal.to(room).emit("server:update:projects", payload);
        console.log(`📁 → Отправлено событие [server:update:projects] в ${room}`);
        break;
      case "issues":
        ioJournal.to(room).emit("server:update:issues", payload);
        console.log(`🧩 → Отправлено событие [server:update:issues] в ${room}`);
        break;
      case "issue":
        ioJournal.to(room).emit("server:update:issue", payload);
        console.log(`🗂️ → Отправлено событие [server:update:issue] в ${room}`);
        break;
      default:
        console.warn(`⚠️ [UNKNOWN] Неподдерживаемый тип обновления: "${type}"`);
    }
  });

  // 🔴 Отключение
  socket.on("disconnect", (reason: string) => {
    console.log(`❎ [DISCONNECT] ${socket.id} (${socket.data.userId ?? "anon"}) — ${reason}`);
  });
};
