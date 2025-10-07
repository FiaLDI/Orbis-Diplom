
export interface messageSliceState {
    activeHistory?: Message[];
    openMessage?: Message;
    uploadstate?: boolean;
    uploadedFiles?: {
        type: string;
        url: string;
    };
    editmode?: {
        enabled: boolean;
        messagesId: string;
        chatId: string;
    };
    reply?: string;
}

export interface Content {
    id: string;
    type: string;
    text: string;
    url: string;
}

export interface Message {
    id: number;
    content: Content[];
    user_id: number;
    chat_id?: number;
    username: string;
    is_edited: boolean;
    timestamp: string;
    reply_to_id: number;
}

export interface MessageGroupp {
    username: string;
    user_id: number;
    minute: string;
    messages: Message[];
}

export type InputChatProps = {
    scrollToBottom: () => void;
};

export interface SingleMessageProps {
    message: Message;
    onClick?: (e: React.MouseEvent) => void;
}

