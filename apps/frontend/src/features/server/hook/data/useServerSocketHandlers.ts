import { useModerationListener, useServerJournalSocket, useServerUpdates } from "@/features/server";

export function useServerSocketHandlers(
    handlers: {
        getProject: any;
        getServerInside: any;
        getServerRoles: any;
        getServerChats: any;
        getChatIssue: any;
    },
    serverId?: string,
    issueId?: string | null
) {
    const { getProject, getServerInside, getServerRoles, getServerChats, getChatIssue } = handlers;
    const { socket } = useServerJournalSocket();
    useModerationListener(socket);

    useServerUpdates(socket, serverId ?? null, getProject, "projects");
    useServerUpdates(socket, serverId ?? null, getServerInside, "settings");
    useServerUpdates(socket, serverId ?? null, getServerRoles, "settings");
    useServerUpdates(socket, serverId ?? null, getServerChats, "chats");
    useServerUpdates(socket, serverId ?? null, getChatIssue, "issue", issueId ?? null);

    return socket;
}
