export interface userState {
    loadedProfiles?: UserInfo[];
    openProfile?: UserInfo;
    isOpenProfile?: boolean;
    chats?: any[];
}

export interface fastUserInfo {
    id: number;
    name: string;
    avatar_url: string;
    is_online: boolean;
}

export interface UserInfo {
    id: number;
    username: string;
    avatar_url: string;
    about: string;
}

