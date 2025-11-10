import { z } from "zod";
import { MessageContentSchema } from "./message.content.dto";

export const MessageEditSchema = z.object({
    id: z.string().min(1, "UserID is required"),
    messageId: z.string().min(1, "MessageID is required"),
    content: z.array(MessageContentSchema).min(1, "At least one content item is required"),
});

export type MessageEditDto = z.infer<typeof MessageEditSchema>;
