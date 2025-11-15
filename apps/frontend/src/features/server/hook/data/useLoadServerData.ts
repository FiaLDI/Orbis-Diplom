import React, { useCallback } from "react";

import {
  setSettingsActive,
  useLazyGetLinksQuery,
  useLazyGetPermissionsQuery,
  useLazyGetServersChatsQuery,
  useLazyGetServersInsideQuery,
  useLazyGetServersMembersQuery,
  useLazyGetServersRolesQuery,
} from "@/features/server";

import {
  useLazyGetProjectQuery,
  useLazyGetStatusesQuery,
  useLazyGetPriorityQuery,
  useLazyGetChatIssueQuery,
  useLazyGetIssuesQuery,
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

  const [getMembers] = useLazyGetServersMembersQuery();
  const [getServer] = useLazyGetServersInsideQuery();
  const [getPermission] = useLazyGetPermissionsQuery();
  const [getServerRoles] = useLazyGetServersRolesQuery();
  const [getProject] = useLazyGetProjectQuery();
  const [getStatuses] = useLazyGetStatusesQuery();
  const [getPriority] = useLazyGetPriorityQuery();
  const [getServerInside] = useLazyGetServersInsideQuery();
  const [getServerChats] = useLazyGetServersChatsQuery();
  const [getChatIssue] = useLazyGetChatIssueQuery();
  const [getIssues] = useLazyGetIssuesQuery();
  const [getServerLinks] = useLazyGetLinksQuery();

  const fetchServerData = useCallback(async () => {
    if (!serverId) return;

    await Promise.all([
      getMembers(serverId),
      getServer(serverId),
      getServerRoles(serverId),
      getProject(serverId),
      getServerChats(serverId),
      getPermission(serverId),
      getStatuses(serverId),
      getPriority(serverId),
      getServerLinks(serverId),
    ]);

    if (issueId) {
      await getChatIssue({ issueId, serverId });
    }

    dispatch(setSettingsActive(false));
  }, [
    serverId,
    issueId,
    getMembers,
    getServer,
    getServerRoles,
    getProject,
    getPermission,
    getStatuses,
    getPriority,
    getChatIssue,
    getServerLinks,
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
    getIssues,
    getMembers,
  };
}
