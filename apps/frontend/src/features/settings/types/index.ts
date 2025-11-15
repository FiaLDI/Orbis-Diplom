export type Theme = "standart" | "light" | "dark";

export type Language = "ru" | "en";

export interface AccountInfo {
  username?: string;
  number?: string;
  email?: string;
}

export interface ProfileInfo {
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  avatar_url?: string;
  gender?: string;
  location?: string;
  about?: string;
}

export interface settingsState {
  accountInfoUpdated?: AccountInfo;
  profileInfoUpdated?: ProfileInfo;
  theme: Theme;
  language: Language;
  notification: boolean;
}

export type AccountFormData = {
  username: string;
  email: string;
  password: string;
  number: string;
};

export interface activeChange {
  username?: string;
  about?: string;
}

export type ProfileFormData = {
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  gender?: string;
  location?: string;
  about?: string;
};
