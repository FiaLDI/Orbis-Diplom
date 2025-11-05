import { z } from "zod";

const emailField = z.string().email("Введите корректный email").min(5, "Минимум 5 символов");

const passwordField = z.string().min(8, "Минимум 8 символов").max(50, "Максимум 50 символов");

export const emailSchema = z.object({
    email: emailField,
});
export type EmailFormData = z.infer<typeof emailSchema>;

export const codeSchema = z.object({
    code: z
        .string()
        .length(6, "Код должен содержать 6 символов")
        .regex(/^\d+$/, "Код должен состоять только из цифр"),
});
export type CodeFormData = z.infer<typeof codeSchema>;

export const registerSchema = z.object({
    username: z.string().min(3, "Минимум 3 символа").max(20, "Максимум 20 символов"),
    password: passwordField,
    birth_date: z.string().refine((val) => !isNaN(Date.parse(val)), "Некорректная дата рождения"),
});
export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: emailField,
    password: passwordField,
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const AuthSchemas = {
    emailSchema,
    codeSchema,
    registerSchema,
    loginSchema,
};

export type AuthFormTypes = {
    Email: EmailFormData;
    Code: CodeFormData;
    Register: RegisterFormData;
    Login: LoginFormData;
};
