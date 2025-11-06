import { z } from "zod";
import { MessageContentSchema } from "./message.content.dto";

export const MessageSendSchema = z.object({
    id: z.number().int().positive("UserID is required"),
    chatId: z.number().int().positive("ChatID is required"),
    replyToId: z.number().int().optional(),
    content: z.array(MessageContentSchema).min(1, "At least one content item is required"),
});

export type MessageSendDto = z.infer<typeof MessageSendSchema>;
