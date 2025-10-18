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
import { AppMenu } from "./components/AppMenu";
import { Component as MessageMenu } from "./components/MessageMenu";
import { FriendList } from "@/features/friends";
import {
  IssueComponent,
  ProjectComponent,
  setOpenProject,
  useLazyGetProjectQuery,
  useLazyGetStatusesQuery,
  useLazyGetPriorityQuery,
} from "@/features/issue";
import { Profile } from "@/features/user";
import { useNotificationSocket } from "@/features/notification/hooks/useNotificationSocket";

export const CommunicatePage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { activeChat, isSettingsActive, activeserver, issues } = useAppSelector(
    (s) => ({
      activeChat: s.chat.activeChat,
      isSettingsActive: s.server.isSettingsActive,
      activeserver: s.server.activeserver,
      issues: s.issue,
    })
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

  const { socket } = useServerJournalSocket();
  useServerUpdates(socket, activeServerId, getProject, dispatch);
  useServerUpdates(socket, activeServerId, getServerInside, dispatch);
  useServerUpdates(socket, activeServerId, getServerRoles, dispatch);

  const { isConnected } = useNotificationSocket();

  const [isMessageMenuOpen, setIsMessageMenuOpen] = useState(true);

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

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen">
      {/* Sidebar (левое меню) */}
      <aside className="flex flex-col">
        <AppMenu />
      </aside>

      
      <Profile />
      
      {/* Main content */}
      <main className="w-full flex h-full relative">
        {/* Меню чатов */}
        {!issueMode && isMessageMenuOpen && <MessageMenu />}

        {/* --- Issue mode */}
        {hasActiveServer && issueMode && (
          <div className="w-full h-full">
            {issues.openProjectId ? (
              <IssueComponent
                name={activeserver?.name}
                serverid={activeServerId}
                projectId={issues.openProjectId}
              />
            ) : (
              <ProjectComponent
                name={activeserver?.name}
                serverid={activeServerId}
              />
            )}
          </div>
        )}

        {/* --- Персональные чаты */}
        {isPersonalChat && (
          <div className="w-full h-full lg:h-screen">
            <ChatComponent />
          </div>
        )}

        {/* --- Серверные чаты */}
        {isServerChat && !isSettingsActive && !isPersonalChat && (
          <div className="w-full h-full lg:h-screen">
            <ChatComponent />
          </div>
        )}

        {/* --- Пустой сервер без чата */}
        {hasActiveServer && !hasActiveChat && !issueMode && !isSettingsActive && (
          <div className="w-full"></div>
        )}

        {/* --- Настройки сервера */}
        {isSettingsActive && <SettingsServer />}

        {/* --- Если нет ни сервера, ни персонального чата → показываем друзей */}
        {!hasActiveServer && !isPersonalChat && <FriendList />}

        {/* --- Участники сервера */}
        {issueMode ? null : <MemberServer />}
      </main>
    </div>
  );
};
