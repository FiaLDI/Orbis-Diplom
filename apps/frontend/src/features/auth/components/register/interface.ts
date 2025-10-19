
export type Step = "email" | "code" | "register";

export interface EmailFormData {
    email: string;
}

export interface CodeFormData {
    code: string;
}

export interface RegisterFormData {
    display_name: string;
    username: string;
    birth_date: string;
    password: string;
}