import { usersChatsWithRelations } from "../types/chat.user.types";
import { serverChatWithRelations } from "../types/chat.server.types";

export type UserChatListItem = {
    id: string;
    name: string | null;
    creatorId: string | null;
    createdAt: Date | null;
    participantIds: string[];
};


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
        this.userChat = userChat ?? [];
        this.serverChat = serverChat ?? [];
    }

    /** 
     * User-centric chat list (domain-normalized)
     * No join tables, no ORM structures
     */
    toUserChatList(): UserChatListItem[] {
        return this.userChat.map((chat) => ({
            id: chat.id,
            name: chat.name,
            creatorId: chat.creator_id,
            createdAt: chat.created_at,
            participantIds: chat.chat_users.map((cu) => cu.user_id),
        }));
    }

    toServerChatList() {
        return this.serverChat.map((chat) => ({
            id: chat.id,
            name: chat.name,
            creatorId: chat.creator_id,
            createdAt: chat.created_at,
        }));
    }
}
