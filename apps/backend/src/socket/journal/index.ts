import jwt from "jsonwebtoken";
import { Socket, Namespace } from "socket.io";
import { redisClient } from "@/config";

type ServerUpdatePayload = {
  serverId: string;
  contextId?: string;
  contextType?: "project" | "issue";
};

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
  socket.on("server-update", (type: string, payload: ServerUpdatePayload) => {
    const { serverId, contextId, contextType } = payload;

    if (!serverId) {
      console.warn(`⚠️ [UPDATE] Пропущен serverId при событии "${type}"`);
      return;
    }

    const room = `server:${serverId}`;

    // Автоматически определяем contextType, если не передан
    const normalizedPayload: ServerUpdatePayload = {
      serverId,
      contextId,
      contextType:
        contextType ??
        (type === "issues"
          ? "project"
          : type === "issue"
          ? "issue"
          : undefined),
    };

    ioJournal.to(room).emit(`server:update:${type}`, normalizedPayload);

    console.log(`📡 [UPDATE] ${type.toUpperCase()} → ${room}`, normalizedPayload);
  });



  // 🔴 Отключение
  socket.on("disconnect", (reason: string) => {
    console.log(`❎ [DISCONNECT] ${socket.id} (${socket.data.userId ?? "anon"}) — ${reason}`);
  });
};
