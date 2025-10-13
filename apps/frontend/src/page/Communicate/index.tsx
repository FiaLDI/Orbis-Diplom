import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { ChatComponent, setActiveChat } from "@/features/chat";
import {
  CreateServerForm,
  MemberServer,
  setActiveServer,
  setSettingsActive,
  SettingsServer,
  useLazyGetServersInsideQuery,
  useLazyGetServersMembersQuery,
} from "@/features/server";
import { UserProfile } from "@/features/user";
import { AppMenu } from "./components/AppMenu";
import { Component as MessageMenu } from "./components/MessageMenu";
import { FriendList, SearchFriends } from "@/features/friends";

export const CommunicatePage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { activeChat, isSettingsActive, activeserver } = useAppSelector((s) => ({
    activeChat: s.chat.activeChat,
    isSettingsActive: s.server.isSettingsActive,
    activeserver: s.server.activeserver,
  }));

  const [triggerMembers] = useLazyGetServersMembersQuery();
  const [getServer] = useLazyGetServersInsideQuery();
  const [isMessageMenuOpen, setIsMessageMenuOpen] = useState(true);

  const activeServerId = activeserver?.id;
  const hasActiveChat = Boolean(activeChat);
  const hasActiveServer = Boolean(activeserver);

  // Загружаем данные при смене сервера
  const fetchServerData = useCallback(async () => {
    if (!activeServerId) return;

    await Promise.all([triggerMembers(activeServerId), getServer(activeServerId)]);
    dispatch(setActiveChat(undefined));
    dispatch(setSettingsActive(false));
  }, [activeServerId, triggerMembers, getServer, dispatch]);

  useEffect(() => {
    fetchServerData();
  }, [fetchServerData]);

  // Условия отображения
  const showChat = !isSettingsActive && hasActiveChat;
  const showEmptyServer = !isSettingsActive && hasActiveServer && !hasActiveChat;

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

        {/* Участники сервера */}
        <MemberServer />
      </main>
    </div>
  );
};
