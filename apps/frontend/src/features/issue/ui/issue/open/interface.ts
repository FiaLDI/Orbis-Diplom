import { chat } from "@/features/chat";

export interface Props {
  serverId: string;
  issueId: string;
  activeIssueChat?: chat;
}
