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
