import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { ChatComponent, setActiveChat } from "@/features/chat";
import {
    MemberServer,
    setSettingsActive,
    SettingsServer,
    useLazyGetPermissionsQuery,
    useLazyGetServersInsideQuery,
    useLazyGetServersMembersQuery,
    useLazyGetServersRolesQuery,
    useServerJournalSocket,
    useServerUpdates,
} from "@/features/server";
import { AppMenu } from "./components";
import { MessageMenu } from "@/features/chat";
import { FriendList } from "@/features/friends";
import {
    IssueComponent,
    ProjectComponent,
    setOpenProject,
    useLazyGetProjectQuery,
    useLazyGetStatusesQuery,
    useLazyGetPriorityQuery,
} from "@/features/issue";
import { Profile, useLazyGetChatsUsersQuery } from "@/features/user";
import { useNotificationSocket } from "@/features/notification";
import { AuditDrawer } from "@/features/moderation";
import { useModerationListener } from "@/features/server";
import { shallowEqual } from "react-redux";

export const Component: React.FC = () => {
    const dispatch = useAppDispatch();

    const {  userId, activeChat, isSettingsActive, activeserver, issues } = useAppSelector(
        (s) => ({
            userId: s.auth.user?.info.id,
            activeChat: s.chat.activeChat,
            isSettingsActive: s.server.isSettingsActive,
            activeserver: s.server.activeserver,
            issues: s.issue,
        }),
        shallowEqual
    );

    const issueMode = issues.issueMode;
    const activeServerId = activeserver?.id;

    const hasActiveServer = Boolean(activeserver);
    const hasActiveChat = Boolean(activeChat);
    const isPersonalChat = activeChat && activeChat.id && !hasActiveServer;

    const isServerChat = activeChat && !!activeChat.id;

    const [triggerMembers] = useLazyGetServersMembersQuery();
    const [getServer] = useLazyGetServersInsideQuery();
    const [getPermission] = useLazyGetPermissionsQuery();
    const [getServerRoles] = useLazyGetServersRolesQuery();
    const [getProject] = useLazyGetProjectQuery();
    const [getStatuses] = useLazyGetStatusesQuery();
    const [getPriority] = useLazyGetPriorityQuery();
    const [getServerInside] = useLazyGetServersInsideQuery();
    const [getPersonalChats] = useLazyGetChatsUsersQuery();

    const { socket } = useServerJournalSocket();
    const { isConnected } = useNotificationSocket();

    useServerUpdates(socket, activeServerId, getProject, dispatch);
    useServerUpdates(socket, activeServerId, getServerInside, dispatch);
    useServerUpdates(socket, activeServerId, getServerRoles, dispatch);
    useModerationListener(socket);

    const [isMessageMenuOpen, setIsMessageMenuOpen] = useState(true);

    const fetchUserData = useCallback(async () => {
        if (!userId) return;

        await Promise.all(
            [getPersonalChats({})]
        )
    }, [userId])

    const fetchServerData = useCallback(async () => {
        if (!activeServerId) return;

        await Promise.all([
            triggerMembers(activeServerId),
            getServer(activeServerId),
            getServerRoles(activeServerId),
            getProject(activeServerId),
            getPermission({}),
            getStatuses({}),
            getPriority({}),
        ]);

        dispatch(setSettingsActive(false));
    }, [
        activeServerId,
        triggerMembers,
        getServer,
        getServerRoles,
        getProject,
        getPermission,
        getStatuses,
        getPriority,
        getPersonalChats,
        dispatch,
        isServerChat,
    ]);

    useEffect(() => {
        if (activeServerId) {
            dispatch(setActiveChat(undefined));
            dispatch(setOpenProject(null));
        }
    }, [activeServerId]);

    useEffect(() => {
        fetchServerData();
    }, [fetchServerData]);

    useEffect(()=> {
        fetchUserData();
    }, [fetchUserData])

    return (
        <div className="flex flex-col lg:flex-row h-screen w-screen">
            <aside className="flex flex-col">
                <AppMenu socket={socket} notificationConnect={isConnected} />
            </aside>

            <Profile />

            <main className="w-full flex h-full relative">
                {!issueMode && isMessageMenuOpen && <MessageMenu />}

                {hasActiveServer && issueMode && (
                    <div className="w-full h-full">
                        {issues.openProjectId ? (
                            <IssueComponent
                                name={activeserver?.name}
                                serverid={activeServerId}
                                projectId={issues.openProjectId}
                            />
                        ) : (
                            <ProjectComponent name={activeserver?.name} serverid={activeServerId} />
                        )}
                    </div>
                )}

                {isPersonalChat && (
                    <div className="w-full h-full lg:h-screen">
                        <ChatComponent />
                    </div>
                )}

                {isServerChat && !isSettingsActive && !isPersonalChat && (
                    <div className="w-full h-full lg:h-screen">
                        <ChatComponent />
                    </div>
                )}

                {hasActiveServer && !hasActiveChat && !issueMode && !isSettingsActive && (
                    <div className="w-full"></div>
                )}

                {isSettingsActive && <SettingsServer />}

                {!hasActiveServer && !isPersonalChat && <FriendList />}

                {issueMode ? null : <MemberServer />}
            </main>
        </div>
    );
};
