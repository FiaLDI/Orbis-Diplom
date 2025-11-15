import { z } from "zod";

export const ServerCreateLinkSchema = z.object({
    id: z.string().min(1, "UserID is required"),
    serverId: z.string().min(1, "ServerID is required"), 
});

export type ServerCreateLinkDto = z.infer<typeof ServerCreateLinkSchema>;

export const ServerDeleteLinkSchema = z.object({
    id: z.string().min(1, "UserID is required"),
    serverId: z.string().min(1, "ServerID is required"), 
    code: z.string().min(1, "Code is required"),
});

export type ServerDeleteLinkDto = z.infer<typeof ServerDeleteLinkSchema>;
