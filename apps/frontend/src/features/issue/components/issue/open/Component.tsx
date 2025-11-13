import React, { useState, useEffect } from "react";
import { Props } from "./interface";
import {
  selectIssueById,
  setOpenIssue,
  useCreateChatIssueMutation,
  useDeleteChatIssueMutation,
  useLazyGetChatIssueQuery,
  useUpdateChatIssueMutation,
} from "@/features/issue";
import { Plus, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { chat, ChatItem, setActiveChat } from "@/features/chat";
import { useTranslation } from "react-i18next";
import { useEmitServerUpdate } from "@/features/server";

export const Component: React.FC<Props> = ({
  projectId,
  serverId,
  issueId,
  issues,
}) => {
  const issue = useAppSelector((s) => selectIssueById(s, issueId));
  const { t } = useTranslation("chat");

  console.log(issue);

  const issueChats = issue.chats;
  const activeChat = useAppSelector((s) => s.chat?.activeChat);
  const [createChat] = useCreateChatIssueMutation();

  const [updateChat] = useUpdateChatIssueMutation();
  const [deleteChat] = useDeleteChatIssueMutation();
  const dispatch = useAppDispatch();
  const emitServerUpdate = useEmitServerUpdate();

  if (!issue) {
    return null;
  }

  const openChat = (chat: chat) => {
    dispatch(setActiveChat(chat));
  };

  return (
    <div className="w-full h-full overflow-x-scroll bg-background/50 text-white list-none flex flex-col">
      <div className="bg-background w-full rounded flex items-center justify-baseline p-5">
        <div className="w-full">Issue</div>
        <button
          className="cursor-pointer p-0 w-fit"
          onClick={() => dispatch(setOpenIssue(null))}
        >
          <X />
        </button>
      </div>
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
            onClick={() => {
              createChat({
                serverId,
                issueId: issue.id,
                data: { name: `Chat for issue #${issue.id}` },
              });
              emitServerUpdate("issue", serverId, issue.id);
            }}
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
                activeChat={activeChat}
                t={t}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
