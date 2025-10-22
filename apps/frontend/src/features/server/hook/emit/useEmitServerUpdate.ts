import { useServerJournalSocket } from "..";

export function useEmitServerUpdate() {
    const { socket } = useServerJournalSocket();

    return (serverId?: number | string | null) => {
        if (!socket || !serverId) return;
        socket.emit("update-into-server", "update-server-active", serverId);
    };
}
