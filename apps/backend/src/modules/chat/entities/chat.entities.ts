import { UserProfile } from "@/modules/users/entity/user.profile";
import { Prisma } from "@prisma/client";
import { usersChatsWithRelations } from "../types/chat.user.types";
import { serverChatWithRelations } from "../types/chat.server.types";

export class Chat {
    private userChat: usersChatsWithRelations[] = [];
    private serverChat: serverChatWithRelations[] = [];

    constructor({
        userChat,
        serverChat,
    }: {
        userChat?: usersChatsWithRelations[];
        serverChat?: serverChatWithRelations[];
    }) {
        this.serverChat = serverChat ?? [];
        this.userChat = userChat ?? [];
    }

    toJSONU() {
        const u = this.userChat;
        return u.map((val) => ({
            id: val.id,
            name: val.name,
            creatorId: val.creator_id,
            createdAt: val.created_at,
            chatUsers: val.chat_users,
        }));
    }

    toJSONS() {
        const s = this.serverChat;
        return s.map((val) => ({
            id: val.id,
            title: val.name,
            creatorId: val.creator_id,
            createdAt: val.created_at,
        }));
    }
}
