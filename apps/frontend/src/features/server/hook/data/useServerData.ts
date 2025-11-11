import { useLoadServerData } from "./useLoadServerData";
import { useServerSocketHandlers } from "./useServerSocketHandlers";

export function useServerData(serverId?: string) {
    const handlers = useLoadServerData({ serverId });

    const socket = useServerSocketHandlers(
        handlers,
        serverId
    );

    return socket;
}
