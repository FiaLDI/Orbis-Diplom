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
} from "@/features/issue";
import { useAppDispatch } from "@/app/hooks";
import { setActiveChat } from "@/features/chat";

export function useLoadServerData({ serverId }: { serverId?: string }) {
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

        dispatch(setSettingsActive(false));
    }, [
        serverId,
        triggerMembers,
        getServer,
        getServerRoles,
        getProject,
        getPermission,
        getStatuses,
        getPriority,
        dispatch,
    ]);

    React.useEffect(() => {
        if (!serverId) return;
        fetchServerData();
    }, [serverId, fetchServerData]);

    return { getProject, getServerInside, getServerRoles, getServerChats };
}
