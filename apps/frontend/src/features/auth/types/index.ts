export interface UserData {
    info: {

        id: string;
        avatar_url: string;
        email: string;
        displayName: string;
        username: string;
        birth_date: string;
        first_name?: string;
        last_name?: string;
        gender?: string;
        location?: string;
        about?: string;
        number?: string;
        
    };
    access_token: string;
    username: string;
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

export interface AuthState {
    user: UserData | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}
