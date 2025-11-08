import { z } from "zod";

export const ServerIdOnlySchema = z.object({
    id: z.string().min(1, "UserId is required"),
    serverId: z.string().min(1, "ServerID is required"),
});

export const ServerChatIdSchema = z.object({
    id: z.string().min(1, "UserId is required"),
    serverId: z.string().min(1, "ServerID is required"),
    chatId: z.string().min(1, "ChatID is required"),
});

export type ServerIdOnlyDto = z.infer<typeof ServerIdOnlySchema>;
export type ServerChatIdDto = z.infer<typeof ServerChatIdSchema>;
