import { Message } from "@/features/messages";

export interface SingleMessageProps {
  message: Message;
  currentUser: any;
  onClick?: (e: React.MouseEvent<HTMLDivElement>, message: Message) => void;
}

export interface MessageGroupp {
  username: string;
  user_id: number;
  avatar_url?: string | null;   // 🔹 добавляем сюда тоже, если группировка по юзеру
  minute: string;
  messages: Message[];
}