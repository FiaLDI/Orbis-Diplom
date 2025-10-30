export interface MessageContent {
    id: string;
    type: "text" | "image" | "file";
    text?: string;
    url?: string;
}

export interface Message {
    id: number;
    chatId: number;
    userId: number;
    username: string;
    avatarUrl?: string | null;
    replyToId?: number | null;
    isEdited: boolean;
    content: MessageContent[];
    createdAt: string;
    updatedAt?: string | null;
}

export interface Content {
    id: string;
    type: "text" | "image" | "file";
    text?: string;
    url?: string;
}

export type ChatHistory = Message[];

export interface messageSliceState {
    activeHistory: Message[];
    histories: Record<string, ChatHistory>;
    openMessage?: Message;
    uploadstate: boolean;   
    activeChat?: {
        id: string;
        name?: string;
    };
    uploadedFiles?: {
        type: string;
        url: string;
    }[];
    editmode?: {
        enabled: boolean;
        messagesId: string;
        chatId: string;
    };
    reply?: string;
}
