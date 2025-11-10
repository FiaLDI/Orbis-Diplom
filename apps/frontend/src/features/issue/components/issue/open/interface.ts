import { Statuses } from "@/features/issue/types";

export interface Props {
    projectId: string;
    serverId: string;
    issueId: string;
    issues: any;
    activeIssueChat: any;
}
