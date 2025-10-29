import { content, messages, Prisma } from "@prisma/client";
import { UserProfile } from "@/modules/users/entity/user.profile";
import { MessageSendDto } from "../dtos/message.send.dto";

export class MessageItemEntity {
    private profile: UserProfile;
    private contentRows: content[];

    constructor(
        private message: messages,
        profile: UserProfile,
        contentRows: content[]
    ) {
        this.profile = profile;
        this.contentRows = contentRows;
    }

    toJSON() {
        const m = this.message;
        const cr = this.contentRows;
        const p = this.profile.toPublicJSON();

        if (!cr || !m) return {};

        return {
            id: m.id,
            chatId: m.chat_id,
            user_id: p.id,
            username: p.username,
            reply_to_id: m.reply_to_id ? Number(m.reply_to_id) : null,
            is_edited: m.is_edited,
            content: cr,
            created_at: m.created_at ? m.created_at.toISOString() : "",
            updated_at: null,
        };
    }

    static toNormalize(
        createdContent: {
            id: string;
            type: "text" | "image" | "file" | "video" | "audio";
            text: string | undefined;
            url: string | undefined;
        }[]
    ) {
        return createdContent.map((c) => ({
            id: c.id,
            type: c.type,
            text: c.text ?? null,
            url: c.url ?? null,
        }));
    }
}
