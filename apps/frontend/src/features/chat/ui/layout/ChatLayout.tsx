import React from "react";
import { HistoryChatComponent, InputChatComponent } from "@/features/messages";
import { X } from "lucide-react";
import { ChatContextMenu } from "@/shared/ui";
import { useChatModel } from "../../model/useChatModel";

export const ChatLayout: React.FC<{
  history: React.ReactNode;
  input: React.ReactNode;
  head: React.ReactNode;
}> = ({ history, input, head }) => {
  return (
    <div className="flex flex-col h-full w-full p-5 rounded-[5px] lg:h-screen ">
      {head}

      {history}

      {input}
    </div>
  );
};
