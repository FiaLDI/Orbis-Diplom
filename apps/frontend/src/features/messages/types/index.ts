export interface MessageContent {
  id: string;
  type: "text" | "image" | "file";
  text?: string;
  url?: string;
}

export interface Message {
  id: number;
  chat_id: number;
  user_id: number;
  username: string;
  avatar_url?: string | null;
  reply_to_id?: number | null;
  is_edited: boolean;
  content: MessageContent[];
  timestamp: string;
  updated_at?: string | null;
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
