import { z } from "zod";
import { MessageContentSchema } from "./message.content.dto";

export const MessageSendSchema = z.object({
    id: z.string().min(1, "UserID is required"),
    chatId: z.string().min(1, "ChatID is required"),
    replyToId: z.string().optional(),
    content: z.array(MessageContentSchema).min(1, "At least one content item is required"),
});

export type MessageSendDto = z.infer<typeof MessageSendSchema>;
