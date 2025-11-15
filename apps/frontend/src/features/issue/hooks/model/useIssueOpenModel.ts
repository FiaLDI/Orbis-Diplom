import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  useCreateChatIssueMutation,
  useUpdateChatIssueMutation,
  useDeleteChatIssueMutation,
} from "@/features/issue/api";
import { chat, setActiveChat } from "@/features/chat";
import { useEmitServerUpdate } from "@/features/server";
import { selectIssueById, setOpenIssue } from "../../slice";
import { useTranslation } from "react-i18next";

export function useIssueOpenModel(serverId: string, issueId: string) {
  const issue = useAppSelector((s) => selectIssueById(s, issueId));
  const { t } = useTranslation("chat");

  const issueChats = issue.chats;
  const [createChat] = useCreateChatIssueMutation();

  const [updateChat] = useUpdateChatIssueMutation();
  const [deleteChat] = useDeleteChatIssueMutation();
  const dispatch = useAppDispatch();
  const emitServerUpdate = useEmitServerUpdate();
  const openChat = (chat: chat) => {
    dispatch(setActiveChat(chat));
  };

  const cloeseIssue = () => {
    dispatch(setOpenIssue(null));
  };

  const createChatHandler = () => {
    if (!serverId) return null;
    createChat({
      serverId,
      issueId: issue.id,
      data: { name: `Chat for issue #${issue.id}` },
    });
    emitServerUpdate("issue", serverId, issue.id, "issue");
  };

  return {
    t,
    issue,
    issueChats,
    updateChat,
    deleteChat,
    openChat,
    cloeseIssue,
    createChatHandler,
  };
}
