import { z } from "zod";

const MIN_AGE = 13;
const MAX_AGE = 120;

export const GetUserChatsSchema = z.object({
    id: z.number().min(1, "UserID is required"),
    email: z.string().email("Invalid email format"),
    username: z.string().min(1, "Username is required"),
    number: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    birth_date: z.string().refine((value) => {
        const d = new Date(value);
        if (isNaN(d.getTime())) return false;

        const now = new Date();
        const yearNow = now.getFullYear();
        const age = yearNow - d.getFullYear();

        return age >= MIN_AGE && age <= MAX_AGE;
    }, "Birth date is out of allowed range"),
    avatar_url: z.string().optional(),
    gender: z.string().optional(),
    location: z.string().optional(),
    about: z.string().optional(),
});

export type GetUserChatsDto = z.infer<typeof GetUserChatsSchema>;
