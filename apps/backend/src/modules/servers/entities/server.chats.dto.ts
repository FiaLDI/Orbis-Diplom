import { z } from "zod";

export const ServerIdOnlySchema = z.object({
    id: z.number().int().positive(),
    serverId: z.number().int().positive(),
});

export const ServerChatIdSchema = z.object({
    id: z.number().int().positive(),
    serverId: z.number().int().positive(),
    chatId: z.number().int().positive(),
});

export type ServerIdOnlyDto = z.infer<typeof ServerIdOnlySchema>;
export type ServerChatIdDto = z.infer<typeof ServerChatIdSchema>;
