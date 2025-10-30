import { z } from "zod";
import { MessageContentSchema } from "./message.content.dto";

export const MessageEditSchema = z.object({
    id: z.number().int().positive("UserID is required"),
    messageId: z.number().int().positive("MessageID is required"),
    content: z.array(MessageContentSchema).min(1, "At least one content item is required"),
});

export type MessageEditDto = z.infer<typeof MessageEditSchema>;
