import {
  useModerationListener,
  useServerJournalSocket,
  useServerUpdates,
} from "@/features/server";

export function useServerSocketHandlers(
  handlers: {
    getProject: any;
    getServerInside: any;
    getServerRoles: any;
    getServerChats: any;
    getChatIssue: any;
    getIssues: any;
    getMembers: any;
  },
  baseContextId?: string | null,
) {
  const {
    getProject,
    getServerInside,
    getServerRoles,
    getServerChats,
    getChatIssue,
    getIssues,
    getMembers,
  } = handlers;
  const { socket } = useServerJournalSocket();

  useServerUpdates(socket, "projects", getProject);
  useServerUpdates(socket, "settings", getServerInside);
  useServerUpdates(socket, "settings", getServerRoles);
  useServerUpdates(socket, "chats", getServerChats);
  useServerUpdates(socket, "members", getMembers);
  useServerUpdates(socket, "issue", getChatIssue, baseContextId ?? null);
  useServerUpdates(socket, "issues", getIssues, baseContextId ?? null);

  return socket;
}
