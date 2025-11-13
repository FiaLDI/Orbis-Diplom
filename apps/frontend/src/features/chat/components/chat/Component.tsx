import React from "react";
import { HistoryChatComponent, InputChatComponent } from "@/features/messages";
import { X } from "lucide-react";
import { ChatContextMenu } from "@/shared/ui";
import { useChatModel } from "../../model/useChatModel";
import { ChatLayout } from "../../ui/layout/ChatLayout";

export const Component: React.FC = () => {
  const { activeChat, bottomRef, topRef, closeChat } = useChatModel();

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
              <div className="text-5xl lg:text-base pl-5 p-2">
                {activeChat.name}
              </div>

              <div className="w-full lg:w-auto">
                <button className="cursor-pointer pl-5 p-2" onClick={closeChat}>
                  <X />
                </button>
              </div>
            </div>
          )}
        />
      }
      history={<HistoryChatComponent bottomRef={bottomRef} topRef={topRef} />}
      input={<InputChatComponent />}
    />
  );
};
