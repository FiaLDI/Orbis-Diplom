export interface UserProfileProps {
    id: string;
    email: string | null;
    username: string | null;
    number: string | null;

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

    user_preferences: {
        user_id: string;
        privacy_settings: string | null;
        timezone: string | null;
        theme: string | null;
        created_at: Date | null;
        updated_at: Date | null;
        confirmed_at: Date | null;
    } | null;

    blocks_initiated: {
        blocked_user_id: string;
    }[];

    blocks_received: {
        id_users: string;
    }[];
}
