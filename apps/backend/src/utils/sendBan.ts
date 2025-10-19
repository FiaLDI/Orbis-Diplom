
import { emitTo } from "@/socket/registry";

export const emitServerBan = (userId: number, serverId: number, reason?: string) => {
  emitTo("journal", `user_${userId}`, "server_banned", { serverId, reason })
};

export const emitServerKick = (userId: number, serverId: number, reason?: string) => {
  emitTo("journal", `user_${userId}`, "server_kicked", { serverId, reason })
};