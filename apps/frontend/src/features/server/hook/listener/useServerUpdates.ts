import { useEffect } from "react";
import type { ServerUpdateType } from "../../types";

export function useServerUpdates(
  socket: any,
  serverId: string | undefined | null,
  trigger: any,
  type: ServerUpdateType,
  issueId?: string | null,
) {
  useEffect(() => {
    if (!socket || !serverId) return;

    const eventName = `server:update:${type}`;

    const handler = (payload?: any) => {
      console.groupCollapsed(`📥 [CLIENT SOCKET] Событие "${eventName}"`);
      console.log("🧩 payload:", payload);
      console.log("📡 serverId (local):", serverId);
      console.log("📡 issueId (local):", issueId);
      console.groupEnd();

      const resolvedServerId = payload?.serverId ?? serverId;
      const resolvedIssueId = payload?.issueId ?? issueId;

      if (!resolvedServerId) {
        console.warn(`⚠️ [CLIENT SOCKET] Нет serverId для события ${type}`);
        return;
      }

      try {
        console.log(`🚀 [CLIENT SOCKET] trigger(${type}) →`, {
          resolvedServerId,
          resolvedIssueId,
        });
        if (resolvedIssueId)
          trigger({ serverId: resolvedServerId, issueId: resolvedIssueId });
        else trigger(resolvedServerId);
      } catch (err) {
        console.error(`❌ Ошибка trigger(${type}):`, err);
      }
    };

    console.log(`👂 [CLIENT SOCKET] Подписка на "${eventName}" (${serverId})`);
    socket.on(eventName, handler);

    return () => socket.off(eventName, handler);
  }, [socket, serverId, issueId, trigger, type]);
}
