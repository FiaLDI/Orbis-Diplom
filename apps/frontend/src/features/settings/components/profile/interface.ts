export interface activeChange {
  username?: string;
  about?: string;
}

export type ProfileFormData = {
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  gender?: "male" | "female" | "other" | "";
  location?: string;
  about?: string;
};
