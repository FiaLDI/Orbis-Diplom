export interface UserUpdateInfo {
    id: string;
    email: string | null;
    username: string | null;
    number: string | null;
    password_hash: string | null;

    user_profile: {
        user_id: string;
        first_name: string | null;
        last_name: string | null;
        birth_date: Date | null;
        avatar_url: string | null;
        gender: string | null;
        location: string | null;
        about: string | null;
        is_online: boolean;
    } | null;
}
