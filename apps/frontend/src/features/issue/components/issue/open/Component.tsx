import React, { useState, useEffect } from "react";
import { ModalLayout } from "@/components/layout/Modal/Modal";
import { Props } from "./interface";
import { selectIssueById, useCreateChatIssueMutation, useCreateIssueMutation, useLazyGetChatIssueQuery, useLazyGetIssuesQuery, useUpdateIssueMutation } from "@/features/issue";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { ChatItem, setActiveChat } from "@/features/chat";

export const Component: React.FC<Props> = ({
  projectId,
  serverId,
  issueId,
  issues,
}) => {
  const issue = useAppSelector((s) => selectIssueById(s, issueId));
  const [getChats] = useLazyGetChatIssueQuery();
  const [createChat] = useCreateChatIssueMutation();
  const [chats, setChats] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (issue) {
      getChats(issue.id).then((res: any) => {
        if (res.data) {
          setChats(res.data);
        }
      });
    }
  }, [issueId]);

  if (!issue ) {
    return null
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-[#2e3ed34f] p-5 text-white list-none flex flex-col gap-1">
      <h4 className="">
        <div className="w-full bg-[#2e3ed34f] p-1 rounded">Title:</div>
        <div className="w-full truncate p-1">{issue.title}</div>
      </h4>
      <p className="">
        <div className="w-full bg-[#2e3ed34f] p-1 rounded">Description:</div>
        <div className="w-full truncate p-1">{issue.description}</div>
      </p>
      <div className="">
        <button
        onClick={() =>
          createChat({
            issueId: issue.id,
            data: { name: `Chat for issue #${issue.id}` },
          }).then(() => {
            // 🔄 обновляем список чатов после создания
            getChats(issue.id).then((res: any) => {
              if (res.data) setChats(res.data);
            });
          })
        }
        className=" bg-blue-500 text-white px-2 py-1 rounded w-fit"
      >
        <Plus />
      </button>
      </div>
      

      <div className="flex flex-col gap-1 [&>li]:bg-[#2e3ed34f] [&>li]:rounded">
        {chats.map((val: any, idx: number) => (
          <ChatItem key={`${idx}-chat-issue-${val.id}`} chat={val} isServer={true}/>
          
        ))}
      </div>
    </div>
  );
};
