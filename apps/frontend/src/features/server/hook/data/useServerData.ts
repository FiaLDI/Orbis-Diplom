import { useLoadServerData } from "./useLoadServerData";
import { useServerSocketHandlers } from "./useServerSocketHandlers";

export function useServerData(serverId?: string, issueId?: string | null) {
    const handlers = useLoadServerData({ serverId, issueId });

    const socket = useServerSocketHandlers(handlers, serverId, issueId);

    return socket;
}
