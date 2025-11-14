import { chat } from "@/features/chat";
import { fastUserInfo, permission } from "@/features/user";

export interface server {
  id: string;
  name: string;
  avatar_url?: string;
  chats: chat[];
  users: fastUserInfo[];
  roles: any;
}

export interface serverState {
  servers?: server[];
  activeserver?: server | undefined;
  isActive?: boolean;
  isCreatingServer?: boolean;
  messegerChange?: boolean;
  userChange?: boolean;
  isSettingsActive?: boolean;
  allPermission?: permission[];
}

export type ServerUpdateType =
  | "settings"
  | "moderation"
  | "chats"
  | "projects"
  | "issues"
  | "issue";

export interface ServerUpdatePayload {
  serverId: string;
  contextId?: string;
  contextType?: string;
}

export interface CreateServerFormData {
  name: string;
}

export interface JoinServerFormData {
  serverId: string;
}
