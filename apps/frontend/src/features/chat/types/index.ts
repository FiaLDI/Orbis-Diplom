export interface chat {
    id: number;
    username: string;
    title?: string;
    type: string;
    chat_id?: string;
    lastmessage: string;
    created_at: string;
    updated_at: string;
    avatar_url: string;
    users: string[];
    owner: number;
}

export interface chatState {
    chat?: chat[];
    activeChat?: chat | undefined;
}
