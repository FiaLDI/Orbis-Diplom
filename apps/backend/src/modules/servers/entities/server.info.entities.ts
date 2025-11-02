import { Chat } from "@/modules/chat/entities/chat.entities";
import { serverType } from "../types/server.type";

export class ServerInfo {
    private chats: Chat;
    private servers: serverType | null;

    constructor(props: { chats: Chat, servers: serverType | null }) {
        this.chats = props.chats;
        this.servers = props.servers;
    }

    toJSON() {
        const s = this.servers;
        const c = this.chats;

        if (!s) return;

        return {
            id: s.id,
            creatorId: s.creator_id,
            name: s.name,
            avatar_url: s.avatar_url,
            createdAt: s.created_at,
            updatedAt: s.updated_at,
            chats: c.toJSONS()
        };
    }
}
