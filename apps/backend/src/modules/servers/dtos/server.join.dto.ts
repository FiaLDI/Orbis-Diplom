import { z } from "zod";

export const ServerJoinSchema = z.object({
    id: z.number().min(1, "UserID is required"),
    serverId: z.number().min(1, "ServerId is required"),
});

export type ServerJoinDto = z.infer<typeof ServerJoinSchema>;
