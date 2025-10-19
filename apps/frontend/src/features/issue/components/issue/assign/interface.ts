import { Statuses } from "@/features/issue/types";

export interface Props {
    projectId: number, 
    serverId: number,
    statuses: {
        name: Statuses;
        id: number
    }[];
    priorities: any;
}