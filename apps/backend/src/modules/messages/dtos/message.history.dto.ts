import { z } from "zod";

export const MessageHistorySchema = z.object({
    id: z.number().min(1, "UserID is required"),
    chatId: z.number().min(1, "ChatID is required"),
    offset: z.number().optional(),
});

export type MessageHistoryDto = z.infer<typeof MessageHistorySchema>;
