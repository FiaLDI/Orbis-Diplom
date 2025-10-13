export interface userState {
    loadedProfiles?: UserInfo[];
    openProfile?: UserInfo;
    isOpenProfile?: boolean;
    chats?: any[];
}

export interface permission {
  id: string;
  name: string;
}

export interface fastUserInfo {
  id: number;
  username: string;
  user_profile: {
    avatar_url: string;
    is_online: boolean;
  };
  user_server: {
    role: {
      id: string;
      name: string;
      permissions: permission[]; // ✅ готовый массив
    };
  }[];
}

export interface UserInfo {
    id: number;
    username: string;
    avatar_url: string;
    about: string;
}

