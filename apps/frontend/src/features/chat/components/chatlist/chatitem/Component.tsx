import React from "react";
import { ChatContextMenu } from "@/shared/ui";
import { Props } from "./inteface";
import { ChatItemLayout } from "@/features/chat/ui/layout/ChatItemLayout";

export const Component: React.FC<Props> = ({
  t,
  chat,
  isServer,
  editQuery,
  deleteQuery,
  openChat,
  activeChat,
}) => {
  if (!openChat) return null;
  if (!chat) return null;

  return (
    <ChatContextMenu
      chat={chat}
      deleteQuery={deleteQuery}
      editQuery={editQuery}
      t={t}
      triggerElement={({ onContextMenu }) => (
        <li
          className="cursor-pointer hover:brightness-90 select-none"
          onClick={() => openChat(chat)}
          onContextMenu={onContextMenu}
        >
          <ChatItemLayout
            isActive={activeChat?.id === chat.id}
            isServer={isServer || false}
            chatAvatarUrl={chat.avatar_url || "/img/icon.png"}
            chatName={chat.name || "unknown"}
          />
        </li>
      )}
    />
  );
};
