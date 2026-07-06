import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setActiveChat } from "@/features/chat";
import { setOpenIssue, setOpenProject, toggleIssueMode } from "@/features/issue";
import { useUserData } from "@/features/user";
import { useNotificationSocket } from "@/features/notification";
import { useServerData } from "@/features/server";
import { shallowEqual } from "react-redux";

export function useCommunicateModel() {
    const dispatch = useAppDispatch();

    const { userId, activeChat, isSettingsActive, server, issues } = useAppSelector(
        (s) => ({
            userId: s.auth.user?.info.id,
            activeChat: s.chat.activeChat,
            isSettingsActive: s.server.isSettingsActive,
            server: s.server,
            issues: s.issue,
        }),
        shallowEqual
    );

    const activeserver = server.activeserver;
    const openProjectId = issues.openProjectId ?? undefined;
    const serverId = activeserver?.id;
    const serverName = activeserver?.name;
    const issueMode = issues.issueMode;

    useUserData(userId);

    const socket = useServerData(serverId, issues.openIssue);

    useEffect(() => {
        if (!serverId) return;

        dispatch(setActiveChat(undefined));
        dispatch(setOpenProject(null));
        dispatch(setOpenIssue(null));

        if (issueMode) dispatch(toggleIssueMode());
    }, [serverId]);

    const ui = useMemo(() => {
        const hasActiveServer = Boolean(activeserver && serverId);
        const hasActiveChat = Boolean(activeChat);

        return {
            activeServerId: serverId,
            hasActiveServer,
            hasActiveChat,
            issueMode,
            isPersonalChat: Boolean(activeChat?.id) && !hasActiveServer,
            isServerChat: Boolean(activeChat?.id) && hasActiveServer,
            isSettingsActive: Boolean(isSettingsActive),
        };
    }, [activeChat, activeserver, serverId, issueMode, isSettingsActive]);

    const { isConnected } = useNotificationSocket();

    return {
        socket,
        ui,
        serverId,
        serverName,
        openProjectId,
        server,
        isConnected,
    };
}
