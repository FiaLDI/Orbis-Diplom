import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { ChatComponent, setActiveChat } from "@/features/chat";
import {
  CreateServerForm,
  MemberServer,
  setActiveServer,
  setSettingsActive,
  SettingsServer,
  useLazyGetPermissionsQuery,
  useLazyGetServersInsideQuery,
  useLazyGetServersMembersQuery,
  useLazyGetServersRolesQuery,
} from "@/features/server";
import { UserProfile } from "@/features/user";
import { AppMenu } from "./components/AppMenu";
import { Component as MessageMenu } from "./components/MessageMenu";
import { FriendList, SearchFriends } from "@/features/friends";
import { IssueComponent, ProjectComponent, setOpenProject, useLazyGetProjectQuery, useLazyGetStatusesQuery, useLazyGetPriorityQuery } from "@/features/issue";

export const CommunicatePage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { activeChat, isSettingsActive, activeserver, openProjectId } = useAppSelector((s) => ({
    activeChat: s.chat.activeChat,
    isSettingsActive: s.server.isSettingsActive,
    activeserver: s.server.activeserver,
    openProjectId: s.issue.openProjectId
  }));
  const issueMode = true;

  const [triggerMembers] = useLazyGetServersMembersQuery();
  const [getServer] = useLazyGetServersInsideQuery();
  const [getPermission] = useLazyGetPermissionsQuery();
  const [getServerRoles] = useLazyGetServersRolesQuery();
  const [getProject] = useLazyGetProjectQuery();
  const [getStatuses] = useLazyGetStatusesQuery();
  const [getPriority] = useLazyGetPriorityQuery()
  const [isMessageMenuOpen, setIsMessageMenuOpen] = useState(true);
  
  const activeServerId = activeserver?.id;
  const hasActiveChat = Boolean(activeChat);
  const hasActiveServer = Boolean(activeserver);

  const fetchServerData = useCallback(async () => {
    if (!activeServerId) return;

    await Promise.all(
      [
        triggerMembers(activeServerId), 
        getServer(activeServerId), 
        getServerRoles(activeServerId),
        getProject(activeServerId),
        getPermission({}),
        getStatuses({}),
        getPriority({})
      ]
    );
    dispatch(setActiveChat(undefined));
    dispatch(setOpenProject(null))
    dispatch(setSettingsActive(false));
  }, [activeServerId, triggerMembers, getServer, getServerRoles, getProject, dispatch]);

  useEffect(() => {
    fetchServerData();
  }, [fetchServerData]);


  const showChat = !isSettingsActive && hasActiveChat;
  const showEmptyServer = !isSettingsActive && hasActiveServer && !hasActiveChat && !issueMode;

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen">
      {/* Sidebar (левое меню) */}
      <aside className="flex flex-col">
        <AppMenu />
        <UserProfile />
        <CreateServerForm />
        <SearchFriends />
      </aside>

      {/* Main content */}
      <main className="w-full flex h-full relative">
        {/* Чаты */}
        {isMessageMenuOpen && <MessageMenu />}

        {/* Контент по условиям */}
        {showChat && (
          <div className="w-full h-full lg:h-screen">
            <ChatComponent />
          </div>
        )}

        {showEmptyServer && <div className="w-full"></div>}

        {isSettingsActive && <SettingsServer />}

        {/* Если нет ни чата, ни сервера → показываем список друзей */}
        {!hasActiveChat && !hasActiveServer && <FriendList />}

        {!hasActiveChat && hasActiveServer && issueMode && <div className="w-full">
            {openProjectId ? <IssueComponent name={activeserver?.name} serverid={activeServerId} projectId={openProjectId}/> : <ProjectComponent name={activeserver?.name} serverid={activeServerId}/>}
          </div>
        }

        {/* Участники сервера */}
        <MemberServer />
      </main>
    </div>
  );
};
