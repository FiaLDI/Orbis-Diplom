
export interface issueState {
    openProjectId: number | null;
    project: any;
    issues: any;
    statuses: {
        name: Statuses;
        id: number
    }[];
    priorities: Priorities[];
}

export type Statuses = "Open" | "In Progress" | "Review" | "Done" | "Closed";
export type Priorities = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";