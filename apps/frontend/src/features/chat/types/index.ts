export interface chat {
  id: string;
  username: string;
  name?: string;
  type: string;
  chat_id?: string;
  lastmessage: string;
  created_at: string;
  updated_at: string;
  avatar_url: string;
  users: string[];
  owner: string;
}

export interface chatState {
  chat?: chat[];
  activeChat?: chat | undefined;
}

export type ChatEditFormData = {
  name: string;
};
