export interface Message {
  id: number;
  content: Content[];
  user_id: number;
  chat_id: number;
  username: string;
  is_edited: boolean;
  timestamp: string;
  reply_to_id?: number | null;
}

export interface Content {
  id: string;
  type: "text" | "image" | "file" | string;
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
