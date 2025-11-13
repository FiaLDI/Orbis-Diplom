import React from "react";
import { Component as ChatItem } from "./chatitem";
import { chat } from "@/features/chat";
import { ChatListProps } from "./inteface";
import { useChatListModel } from "../../model/useChatListModel";
import { ChatListLayout } from "../../ui/layout/ChatListLayout";

export const Component: React.FC<ChatListProps> = ({ isServer, search }) => {
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
