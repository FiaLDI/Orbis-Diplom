import React from "react";
import { ChatContextMenu, CloseButton, HeadComponent } from "@/shared/ui";
import { ChatLayout } from "@/features/chat/ui";
import { ChatView } from "@/features/messages";
import { useChatModel } from "@/features/chat/hooks";

export const Chat: React.FC = () => {
  const { activeChat, closeChat } = useChatModel();

  if (!activeChat) {
    return null;
  }

  return (
    <ChatLayout
      head={
        <ChatContextMenu
          chat={activeChat}
          triggerElement={({ onContextMenu }) => (
            <div
              className="flex bg-background text-white text-1xl justify-between items-center flex-wrap shrink-0"
              onContextMenu={onContextMenu}
            >
              <HeadComponent title={activeChat.name} />

              <CloseButton handler={closeChat} />
            </div>
          )}
        />
      }
      view={<ChatView />}
    />
  );
};
