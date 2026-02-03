import { z } from "zod";

export const UserDeleteSchema = z.object({
    id: z.string().min(1, "UserID is required"),
});

export type UserDeleteDto = z.infer<typeof UserDeleteSchema>;
