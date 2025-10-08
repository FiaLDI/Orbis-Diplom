import { Message } from "@/features/messages";

export interface SingleMessageProps {
    message: Message;
    onClick?: (e: React.MouseEvent) => void;
}

export interface MessageGroupp {
    username: string;
    user_id: number;
    minute: string;
    messages: Message[];
}