import { z } from "zod";

export const ServerUpdateSchema = z.object({
    id: z.string().min(1, "UserId is required"),
    serverId: z.string().min(1, "ServerID is required"),
    name: z.string().min(1).max(128).optional(),
    avatar_url: z.string().url().optional(),
});

export type ServerUpdateDto = z.infer<typeof ServerUpdateSchema>;
