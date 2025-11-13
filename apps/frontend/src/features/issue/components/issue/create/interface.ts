import { Statuses } from "@/features/issue/types";

export interface Props {
    projectId: string;
    serverId: string;
    statuses: {
        name: Statuses;
        id: number;
    }[];
    priorities: any;
}

export interface IssueFormData {
    title: string;
    description: string;
    statusId: number;
    priority: string;
    due_date: string;
    parent_id?: string | null;
}
