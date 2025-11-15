import { useEffect } from "react";
import type { ServerUpdateType } from "../../types";

type Payload = { serverId: string; contextId?: string };

export function useServerUpdates(
  socket: any,
  type: ServerUpdateType,
  trigger: (arg: any) => void,
  baseContextId?: string | null,
) {
  useEffect(() => {
    if (!socket?.on) return;

    const eventName = `server:update:${type}`;

    const handler = (payload: Payload) => {
      const serverId = payload?.serverId;
      const contextId = payload?.contextId ?? baseContextId ?? null;
      if (!serverId)
        return console.warn(`⚠️ ${eventName}: нет serverId`, payload);

      switch (type) {
        case "projects":
        case "settings":
        case "chats":
        case "members":
          trigger(serverId);
          break;

        case "issues":
          if (!contextId) return console.warn(`⚠️ ${eventName}: нет projectId`);
          trigger({ serverId, projectId: contextId });
          break;

        case "issue":
          if (!contextId) return console.warn(`⚠️ ${eventName}: нет issueId`);
          trigger({ serverId, issueId: contextId });
          break;

        default:
          console.warn(`⚠️ Необработанный type: ${type}`);
      }
    };

    socket.on(eventName, handler);
    return () => socket.off(eventName, handler);
  }, [socket, type, trigger, baseContextId]);
}
