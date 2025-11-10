import { z } from "zod";

export const ServerJoinSchema = z.object({
    id: z.string().min(1, "UserID is required"),
    serverId: z.string().min(1, "ServerId is required"),
});

export type ServerJoinDto = z.infer<typeof ServerJoinSchema>;
