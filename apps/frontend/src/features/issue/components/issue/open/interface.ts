import { Statuses } from "@/features/issue/types";

export interface Props {
    projectId: number, 
    serverId: number,
    issueId: number,
    issues:any;
    activeIssueChat: any;
}