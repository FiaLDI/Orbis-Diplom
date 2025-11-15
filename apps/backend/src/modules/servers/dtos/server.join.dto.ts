import { z } from "zod";

export const ServerJoinSchema = z.object({
    id: z.string().min(1, "UserID is required"),
    code: z.string().min(1, "Invite Code is required"),
});

export type ServerJoinDto = z.infer<typeof ServerJoinSchema>;
