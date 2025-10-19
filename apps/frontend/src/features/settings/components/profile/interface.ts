
export interface activeChange {
    username?: string;
    about?: string;
}

export interface FormData {
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  location: string;
  about: string;
  avatar_url?: string;
}