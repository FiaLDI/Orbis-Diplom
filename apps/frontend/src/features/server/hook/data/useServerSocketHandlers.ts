import { useModerationListener, useServerJournalSocket, useServerUpdates } from "@/features/server";

import { useAppDispatch } from "@/app/hooks";

export function useServerSocketHandlers(
    handlers: {
        getProject: any;
        getServerInside: any;
        getServerRoles: any;
        getServerChats: any;
    },
    serverId?: string
) {
    const { getProject, getServerInside, getServerRoles, getServerChats } = handlers;
    const { socket } = useServerJournalSocket();
    useModerationListener(socket);
    const dispatch = useAppDispatch();

    useServerUpdates(socket, serverId ?? null, getProject, dispatch);
    useServerUpdates(socket, serverId ?? null, getServerInside, dispatch);
    useServerUpdates(socket, serverId ?? null, getServerRoles, dispatch);
    useServerUpdates(socket, serverId ?? null, getServerChats, dispatch);

    return socket;
}
