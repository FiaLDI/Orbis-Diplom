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
    console.log(
      `🎧 Подписка на ${eventName} socket.id:`,
      socket?.id ?? "(pending)",
    );

    const handler = (payload: Payload) => {
      const serverId = payload?.serverId;
      const contextId = payload?.contextId ?? baseContextId ?? null;
      if (!serverId)
        return console.warn(`⚠️ ${eventName}: нет serverId`, payload);

      switch (type) {
        // эндпоинты, которые ждут ТОЛЬКО строку serverId
        case "projects":
        case "settings":
        case "chats":
          // RTK query(getProject / getServerInside / getServerChats) -> query(serverId: string)
          trigger(serverId);
          break;

        // список задач проекта
        case "issues":
          if (!contextId) return console.warn(`⚠️ ${eventName}: нет projectId`);
          // RTK query(getIssues) -> query({ serverId, projectId })
          trigger({ serverId, projectId: contextId });
          break;

        // одна задача (или зависимые данные вроде getChatIssue)
        case "issue":
          if (!contextId) return console.warn(`⚠️ ${eventName}: нет issueId`);
          // RTK query(getChatIssue / getIssue) -> query({ serverId, issueId })
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
