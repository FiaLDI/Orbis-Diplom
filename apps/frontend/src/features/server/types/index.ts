import { chat } from "@/features/chat";
import { fastUserInfo, permission } from "@/features/user";

export interface server {
    id: number;
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
