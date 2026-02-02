import React from "react";
import { Props } from "./interface";
import { Plus, X } from "lucide-react";
import { chat, ChatItem } from "@/features/chat";
import { useIssueOpenModel } from "@/features/issue/hooks/model/useIssueOpenModel";
import { ModalHead } from "@/shared/ui/Modal";

export const Component: React.FC<Props> = ({
  serverId,
  issueId,
  activeIssueChat,
}) => {
  const {
    t,
    issue,
    issueChats,
    updateChat,
    deleteChat,
    openChat,
    cloeseIssue,
    createChatHandler,
  } = useIssueOpenModel(serverId, issueId);

  if (!issue) {
    return null;
  }

  return (
    <div className="w-full h-full overflow-x-scroll bg-background/50 text-white list-none flex flex-col">
      <ModalHead>
        <div className="w-full">Issue</div>
        <button className="cursor-pointer p-0 w-fit" onClick={cloeseIssue}>
          <X />
        </button>
      </ModalHead>
      <div className="p-5">
        <h4 className="">
          <div className="w-full bg-foreground/50 p-1 rounded">Title:</div>
          <div className="w-full whitespace-normal p-1">{issue.title}</div>
        </h4>
        <p className="">
          <div className="w-full bg-foreground/50 p-1 rounded">
            Description:
          </div>
          <div className="w-full  whitespace-wrap p-1">{issue.description}</div>
        </p>
        <div className="">
          <button
            onClick={createChatHandler}
            className=" bg-foreground/50 text-white px-2 py-1 rounded w-fit"
          >
            <Plus />
          </button>
        </div>

        <div className="flex flex-col gap-1 [&>li]:bg-foreground/50 [&>li]:rounded">
          {issueChats &&
            issueChats.length &&
            issueChats.map((val: chat, idx: number) => (
              <ChatItem
                key={`${idx}-chat-issue-${val.id}`}
                chat={val}
                isServer={true}
                editQuery={updateChat}
                deleteQuery={deleteChat}
                openChat={() => openChat(val)}
                activeChat={activeIssueChat}
                t={t}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
