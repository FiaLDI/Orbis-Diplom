
export type Theme = "standart" | "light" | "dark";

export type Language = "ru" | "en";

export interface AccountInfo {
    username?: string;
    number?: string;
    email?: string;
}

export interface ProfileInfo {
    avatar_url?: string;
    about?: string;
}

export interface settingsState {
    accountInfoUpdated?: AccountInfo;
    profileInfoUpdated?: ProfileInfo
    theme: Theme;
    language: Language;
    notification: boolean;
}

