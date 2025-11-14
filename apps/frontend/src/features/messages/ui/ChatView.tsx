import React from "react";
import { MessagesList } from "./history/list";
import { MessageInput } from "./input";

export const ChatView: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full bg-background/50">
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessagesList />
      </div>
      <div className="border-t border-foreground/30">
        <MessageInput />
      </div>
    </div>
  );
};
