import React, { useCallback } from "react";

import {
  setSettingsActive,
  useLazyGetPermissionsQuery,
  useLazyGetServersChatsQuery,
  useLazyGetServersInsideQuery,
  useLazyGetServersMembersQuery,
  useLazyGetServersRolesQuery,
  useModerationListener,
  useServerJournalSocket,
  useServerUpdates,
} from "@/features/server";

import {
  setOpenProject,
  useLazyGetProjectQuery,
  useLazyGetStatusesQuery,
  useLazyGetPriorityQuery,
  useLazyGetChatIssueQuery,
} from "@/features/issue";
import { useAppDispatch } from "@/app/hooks";

export function useLoadServerData({
  serverId,
  issueId,
}: {
  serverId?: string;
  issueId?: string | null;
}) {
  const dispatch = useAppDispatch();

  const [triggerMembers] = useLazyGetServersMembersQuery();
  const [getServer] = useLazyGetServersInsideQuery();
  const [getPermission] = useLazyGetPermissionsQuery();
  const [getServerRoles] = useLazyGetServersRolesQuery();
  const [getProject] = useLazyGetProjectQuery();
  const [getStatuses] = useLazyGetStatusesQuery();
  const [getPriority] = useLazyGetPriorityQuery();
  const [getServerInside] = useLazyGetServersInsideQuery();
  const [getServerChats] = useLazyGetServersChatsQuery();
  const [getChatIssue] = useLazyGetChatIssueQuery();

  const fetchServerData = useCallback(async () => {
    if (!serverId) return;

    await Promise.all([
      triggerMembers(serverId),
      getServer(serverId),
      getServerRoles(serverId),
      getProject(serverId),
      getServerChats(serverId),
      getPermission(serverId),
      getStatuses(serverId),
      getPriority(serverId),
    ]);

    if (issueId) {
      await getChatIssue({ issueId, serverId });
    }

    dispatch(setSettingsActive(false));
  }, [
    serverId,
    issueId,
    triggerMembers,
    getServer,
    getServerRoles,
    getProject,
    getPermission,
    getStatuses,
    getPriority,
    getChatIssue,
    dispatch,
  ]);

  React.useEffect(() => {
    if (!serverId) return;
    fetchServerData();
  }, [serverId, fetchServerData]);

  return {
    getProject,
    getServerInside,
    getServerRoles,
    getServerChats,
    getChatIssue,
  };
}
