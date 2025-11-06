import { z } from "zod";

export const ServerInfoSchema = z.object({
    id: z.number().min(1, "UserID is required"),
    serverId: z.number().min(1, "ServerID is required"),
});

export type ServerInfoDto = z.infer<typeof ServerInfoSchema>;
