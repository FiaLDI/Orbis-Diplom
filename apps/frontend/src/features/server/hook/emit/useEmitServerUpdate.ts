import { useServerJournalSocket } from "..";
import { ServerUpdatePayload, ServerUpdateType } from "../../types";

export function useEmitServerUpdate() {
  const { socket } = useServerJournalSocket();

  return (
    type: ServerUpdateType,
    serverId: string,
    contextId?: string,
    contextType?: "project" | "issue",
  ) => {
    if (!socket || !serverId) return;

    const payload: ServerUpdatePayload = {
      serverId,
      contextId,
      contextType,
    };

    console.log("🚀 [EMIT] server-update", { type, payload });

    socket.emit("server-update", type, payload);
  };
}
