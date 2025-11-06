import { z } from "zod";

export const UserServersSchema = z.object({
    id: z.number().min(1, "UserID is required"),
});

export type UserServersDto = z.infer<typeof UserServersSchema>;
