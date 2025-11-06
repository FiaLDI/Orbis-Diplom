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
import { ChatItem } from "@/features/chat";

export const Component: React.FC<Props> = ({ projectId, serverId, issueId, issues }) => {
    const issue = useAppSelector((s) => selectIssueById(s, issueId));
    const [getChats] = useLazyGetChatIssueQuery();
    const [createChat] = useCreateChatIssueMutation();

    const [updateChat] = useUpdateChatIssueMutation();
    const [deleteChat] = useDeleteChatIssueMutation();
    const [chats, setChats] = useState<any[]>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (issue) {
            getChats({ serverId, issueId: issue.id }).then((res: any) => {
                if (res.data) {
                    setChats(res.data);
                }
            });
        }
    }, [issueId]);

    if (!issue) {
        return null;
    }

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
                    <div className="w-full bg-foreground/50 p-1 rounded">Description:</div>
                    <div className="w-full  whitespace-wrap p-1">{issue.description}</div>
                </p>
                <div className="">
                    <button
                        onClick={() =>
                            createChat({
                                serverId,
                                issueId: issue.id,
                                data: { name: `Chat for issue #${issue.id}` },
                            }).then(() => {
                                getChats({ serverId, issueId: issue.id }).then((res: any) => {
                                    if (res.data) setChats(res.data);
                                });
                            })
                        }
                        className=" bg-foreground/50 text-white px-2 py-1 rounded w-fit"
                    >
                        <Plus />
                    </button>
                </div>

                <div className="flex flex-col gap-1 [&>li]:bg-foreground/50 [&>li]:rounded">
                    {chats.map((val: any, idx: number) => (
                        <ChatItem
                            key={`${idx}-chat-issue-${val.id}`}
                            chat={val}
                            isServer={true}
                            editQuery={updateChat}
                            deleteQuery={deleteChat}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
