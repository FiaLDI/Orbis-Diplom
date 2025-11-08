export class IssueListEntity {
    constructor(private issues: any[]) {}

    /** Собрать user_id из assignees */
    getAssigneeIds(): string[] {
        const ids = new Set<string>();

        for (const issue of this.issues) {
            issue.assignees?.forEach((a: any) => {
                if (a.user_id) ids.add(a.user_id);
            });
        }
        return [...ids];
    }

    /** Alias чтобы PlanningService не ломался */
    getAssigneeUserIds(): string[] {
        return this.getAssigneeIds();
    }

    /** Собрать chat_id из chat_issues */
    getChatIds(): string[] {
        const ids = new Set<string>();

        for (const issue of this.issues) {
            issue.chat_issues?.forEach((ci: any) => {
                if (ci.chat_id) ids.add(ci.chat_id);
            });
        }
        return [...ids];
    }

    /** flat representation */
    toFlatJSON(profilesMap: Map<string, any>, chatsMap: Map<string, any>) {
        return this.issues.map((issue: any) => ({
            id: issue.id,
            title: issue.title,
            description: issue.description,
            priority: issue.priority,
            status: issue.status,
            parentId: issue.parent_id,

            assignees: issue.assignees.map((a: any) => profilesMap.get(a.user_id)).filter(Boolean),

            chats: issue.chat_issues.map((ci: any) => chatsMap.get(ci.chat_id)).filter(Boolean),
        }));
    }

    private buildTree(list: any[], parentId: string | null = null): any[] {
        return list
            .filter((i) => i.parentId === parentId)
            .map((i) => ({
                ...i,
                subtasks: this.buildTree(list, i.id),
            }));
    }

    toTreeJSON(profilesMap: Map<string, any>, chatsMap: Map<string, any>) {
        const flat = this.toFlatJSON(profilesMap, chatsMap);
        return this.buildTree(flat);
    }
}
