import { ioJournal } from "@/server";

/**
 * Отправить пользователю событие бана
 * (используется в moderation.controller)
 */
export const emitServerBan = (userId: number, serverId: number, reason?: string) => {
  ioJournal.to(`user_${userId}`).emit("server_banned", { serverId, reason });
  console.log(`[BAN] Emit server_banned -> user:${userId} (server ${serverId})`);
};

export const emitServerKick = (userId: number, serverId: number, reason?: string) => {
  ioJournal.to(`user_${userId}`).emit("server_kicked", { serverId, reason });
  console.log(`[KICK] Sent 'server_kicked' to user:${userId} (server:${serverId})`);
};