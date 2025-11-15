import React from "react";
import { ChatItem, ChatListLayout } from "@/features/chat/ui";
import { useChatListModel } from "@/features/chat/hooks";
import { chat } from "@/features/chat";

export interface ChatListProps {
  isServer?: boolean;
  search?: string;
}

export const ChatList: React.FC<ChatListProps> = ({ isServer, search }) => {
  const { t, filteredServer, filteredPersonal, activeChat, openChat } =
    useChatListModel(search);

  return (
    <ChatListLayout>
      {!isServer
        ? filteredPersonal.map((val, index) => (
            <ChatItem
              key={`${index}-chat-personal-${val.id}`}
              chat={val}
              activeChat={activeChat}
              t={t}
              openChat={openChat}
            />
          ))
        : filteredServer.map((val: chat, index: number) => (
            <ChatItem
              key={`${index}-chat-server-${val.id}`}
              chat={val}
              activeChat={activeChat}
              t={t}
              openChat={openChat}
              isServer
            />
          ))}
    </ChatListLayout>
  );
};
