import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setOpenIssue, setOpenProject } from "..";

export function useIssueModel() {
  const issue = useAppSelector((s) => s.issue);
  const activeIssueChat = useAppSelector((s) => s.chat.activeChat);
  const membersServer = useAppSelector(
    (s) => s.server.activeserver?.users ?? [],
  );

  const dispatch = useAppDispatch();

  const openIssue = (task: any) => {
    dispatch(setOpenIssue(task.id));
  };

  const back = () => {
    dispatch(setOpenProject(null));
  };

  return {
    back,
    issue,
    membersServer,
    activeIssueChat,
    openIssue,
  };
}
