import { BaseMessageEntity } from "./abstract/base.message.entity";
import { UserProfile } from "@/modules/users/entity/user.profile";
import type { Prisma } from "@prisma/client";

export class MessageListEntity {
    constructor(
        private messages: Prisma.messagesGetPayload<{
            include: {
                messages_content: {
                    include: { content: { select: { id: true; text: true; url: true } } };
                };
            };
        }>[]
    ) {}

    getUserIds() {
        return [...new Set(this.messages.map((m) => m.user_id).filter(Boolean))];
    }

    toJSON(profilesMap: Map<number, UserProfile>) {
        return this.messages
            .map((m) => {
                const profile = profilesMap.get(m.user_id ?? -1);
                if (!profile) return null;

                const contentRows = m.messages_content.map((mc) => ({
                    ...mc.content,
                    type: mc.type ?? "text",
                    size: mc.size,
                    uploaded_at: mc.uploaded_at,
                }));

                const entity = new (class extends BaseMessageEntity {})(m, profile, contentRows);
                return entity.toJSON();
            })
            .filter(Boolean);
    }
}
