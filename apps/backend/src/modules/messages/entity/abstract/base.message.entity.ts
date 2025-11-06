import type { content, messages } from "@prisma/client";
import type { UserProfile } from "@/modules/users/entity/user.profile";

export abstract class BaseMessageEntity {
    protected message: messages;
    protected profile: UserProfile;
    protected contentRows: content[];

    constructor(message: messages, profile: UserProfile, contentRows: content[]) {
        this.message = message;
        this.profile = profile;
        this.contentRows = contentRows;
    }

    toJSON() {
        const m = this.message;
        const p = this.profile.toPublicJSON();
        const cr = this.contentRows;

        return {
            id: m.id,
            chatId: m.chat_id,
            userId: p.id,
            username: p.username,
            avatarUrl: p.avatar_url ?? null,
            replyToId: m.reply_to_id ?? null,
            isEdited: m.is_edited,
            content: cr.map((c) => ({
                id: c.id,
                type: (c as any).type ?? "text",
                text: c.text ?? null,
                url: c.url ?? null,
                size: (c as any).size ?? null,
                uploadedAt: (c as any).uploaded_at
                    ? new Date((c as any).uploaded_at).toISOString()
                    : null,
            })),
            createdAt: m.created_at?.toISOString() ?? "",
            updatedAt: m.updated_at?.toISOString() ?? null,
        };
    }
}
