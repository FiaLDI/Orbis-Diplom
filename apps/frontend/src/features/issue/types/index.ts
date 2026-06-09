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

export interface IssueFormData {
  title: string;
  description: string;
  statusId: number;
  priority: string;
  due_date: string;
  parentId?: string | null;
}

export interface IssueFormProps {
  projectId: string;
  serverId: string;
  statuses: { id: number; name: Statuses }[];
  priorities: string[];
  issues: any[];
  initialData?: any | null;
  onClose?: () => void;
}

export interface ProjectEditFormData {
  name: string;
  description: string;
}
