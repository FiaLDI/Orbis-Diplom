export interface userState {
    loadedProfiles?: UserInfo[];
    openProfile?: UserInfo;
    isOpenProfile?: boolean;
    chats?: any[];
}

export interface permission {
    id: string;
    name: string;
    color?: string;
}

export interface fastUserInfo {
    id: string;
    username: string;
    avatar_url: string | null;
    is_online: boolean;

    roles: {
        id: string;
        name: string;
        color?: string;
        permissions: permission[];
    }[];
}

export interface UserInfo {
    id: string;
    username: string;
    email?: string | null;
    number?: string | null;

    avatar_url?: string | null;
    about?: string | null;

    first_name?: string | null;
    last_name?: string | null;
    birth_date?: string | null;
    gender?: string | null;
    location?: string | null;
    is_blocked?: boolean;
}
