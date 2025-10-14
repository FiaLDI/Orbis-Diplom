import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { ChatList, setActiveChat } from "@/features/chat";
import { MenuButton } from "../ui/Button";
import { useNavigate, Navigate } from "react-router-dom";
import { useServerJournalContext } from "@/contexts/ServerJournalSocketContext";
import { ContextMenu, ServerHeader, setSettingsActive, useCreateChatMutation, useLazyGetServersInsideQuery, useServerUpdates } from "@/features/server";
import { useLazyGetChatsUsersQuery } from "@/features/user";

export const Component: React.FC = () => {
  const { userId, isSettingsActive, activeServer } = useAppSelector((s) => ({
    userId: s.auth.user?.info.id,
    isSettingsActive: s.server.isSettingsActive,
    activeServer: s.server.activeserver,
  }));

  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const { socket } = useServerJournalContext();

  const [trigger] = useLazyGetServersInsideQuery();
  const [getPersonalChats] = useLazyGetChatsUsersQuery();
  const [createText] = useCreateChatMutation();

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // загрузка личных чатов
  useEffect(() => {
    if (userId) getPersonalChats(userId);
  }, [userId]);

  // слушаем обновления сервера через сокет
  useServerUpdates(socket, activeServer?.id, trigger, dispatch);

  // редирект если нет активного сервера
  if (!activeServer) {
    return <Navigate to="/app" replace />;
  }

  const isChat = !activeServer?.id;

  const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY });
  };

  const handleServerSettings = () => {
    if (!isChat) dispatch(setSettingsActive(!isSettingsActive));
  };

  return (
    <div className="absolute lg:relative z-20 flex flex-col bg-[rgb(81,110,204)] lg:bg-[rgba(81,110,204,0.12)] gap-5 justify-between h-full w-full lg:min-w-[250px] lg:max-w-[250px]">
      <div className="flex flex-col gap-0 h-full" onContextMenu={handleContextMenu}>
        {activeServer ? (
          <ServerHeader name={activeServer.name} onSettingsToggle={handleServerSettings} />
        ) : (
          <div className="text-5xl lg:text-base flex flex-col gap-5 text-white p-5">
            <MenuButton handler={() => {}}>Search</MenuButton>
            <MenuButton handler={() => dispatch(setActiveChat(undefined))}>Friends</MenuButton>
          </div>
        )}

        <ChatList isServer={!isChat} />

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onCreateChat={() => {
              if (!socket) return;
              createText({ id: activeServer?.id });
              socket.emit("update-into-server", "update-server-active", activeServer?.id);
            }}
          />
        )}
      </div>
    </div>
  );
};
