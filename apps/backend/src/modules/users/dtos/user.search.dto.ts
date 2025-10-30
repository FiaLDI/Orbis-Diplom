import { z } from "zod";

export const SearchUserSchema = z.object({
    id: z.number().min(1, "UserID is required"),
    name: z.string().min(1, "Name is required"),
});

export type SearchUserDto = z.infer<typeof SearchUserSchema>;
