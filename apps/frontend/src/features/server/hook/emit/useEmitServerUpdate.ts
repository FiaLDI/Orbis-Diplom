import { useServerJournalSocket } from "..";
import { ServerUpdatePayload, ServerUpdateType } from "../../types";

export function useEmitServerUpdate() {
    const { socket } = useServerJournalSocket();

    return (type: ServerUpdateType, serverId: string, issueId?: string) => {
        if (!socket || !serverId) return;
        const payload: ServerUpdatePayload = { serverId, issueId };
        socket.emit("server-update", type, payload);
    };
}
