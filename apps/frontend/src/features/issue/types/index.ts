import { chat } from "@/features/chat";

export interface issueState {
  openProjectId: string | null;
  project: any;
  issues: any;
  statuses: {
    name: Statuses;
    id: number;
  }[];
  priorities: Priorities[];
  issueMode: boolean;
  openIssue: string | null;
}

export type Statuses = "Open" | "In Progress" | "Review" | "Done" | "Closed";
export type Priorities = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
