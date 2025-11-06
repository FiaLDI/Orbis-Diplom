import { UserProfile } from "@/modules/users/entity/user.profile";

export class IssueEntity {
    constructor(
        private raw: any,
        private assignees: UserProfile[],
        private chats: any[]
    ) {}

    toJSON() {
        return {
            id: this.raw.id,
            title: this.raw.title,
            description: this.raw.description,
            priority: this.raw.priority,
            status: this.raw.status,
            parentId: this.raw.parent_id,

            assignees: this.assignees.map((u) => u.toJSON()),
            chats: this.chats.map((c) => ({
                id: c.chat.id,
                name: c.chat.name,
                createdAt: c.chat.created_at,
            })),

            createdAt: this.raw.created_at,
            updatedAt: this.raw.updated_at,
        };
    }
}
