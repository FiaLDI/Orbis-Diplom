import { useEffect } from "react";

export function useServerUpdates(
    socket: any,
    serverId: string | undefined,
    trigger: any,
    dispatch: any
) {
    useEffect(() => {
        if (!socket || !serverId) return;

        const updateServer = () => {
            trigger(serverId);
        };

        socket.on("update-into-server", updateServer);
        return () => socket.off("update-into-server", updateServer);
    }, [socket, serverId, trigger, dispatch]);
}
