import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { ChatList, setActiveChat } from "@/features/chat";
import { MenuButton } from "../../ui/Button";
import { ContextMenu, ServerHeader, setSettingsActive, useCreateChatMutation, useEmitServerUpdate } from "@/features/server";
import { useLazyGetChatsUsersQuery } from "@/features/user";
import { toggleIssueMode } from "@/features/issue";
import { shallowEqual } from "react-redux";

export const Component: React.FC = () => {
  const { userId, isSettingsActive, activeServer } = useAppSelector((s) => ({
    userId: s.auth.user?.info.id,
    isSettingsActive: s.server.isSettingsActive,
    activeServer: s.server.activeserver,
  }),
      shallowEqual);

  const dispatch = useAppDispatch();
  const emitUpdate = useEmitServerUpdate();

  const [getPersonalChats] = useLazyGetChatsUsersQuery();
  const [createText] = useCreateChatMutation();

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (userId) getPersonalChats(userId);
  }, [userId]);

  const isChat = !activeServer?.id;

  const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY });
  };

  const handleServerSettings = () => {
    if (!isChat) dispatch(setSettingsActive(!isSettingsActive));
  };

  const handleProject = () => {
    if (!isChat) dispatch(toggleIssueMode());
        dispatch(setActiveChat(undefined));
  };

  return (
    <div className="absolute lg:relative z-20 flex flex-col bg-background/50 gap-5 justify-between h-full w-full lg:min-w-[250px] lg:max-w-[250px]">
      <div className="flex flex-col gap-0 h-full" onContextMenu={handleContextMenu}>
        {activeServer ? (
          <ServerHeader 
            name={activeServer.name} 
            onSettingsToggle={handleServerSettings}
            onProjectToggle={handleProject}
          />
        ) : (
          <div className="text-5xl lg:text-base flex flex-col gap-5 text-white p-5">
            <MenuButton handler={() => {}}>Search</MenuButton>
            <MenuButton handler={() => dispatch(setActiveChat(undefined))}>Friends</MenuButton>
          </div>
        )}

        <ChatList isServer={!isChat} />

        {(!isChat && contextMenu) && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onCreateChat={() => {
              if (activeServer?.id) {
                createText({ id: activeServer.id });
              }
              setContextMenu(null);

              emitUpdate(activeServer?.id)
            }}
          />
        )}
      </div>
    </div>
  );
};
