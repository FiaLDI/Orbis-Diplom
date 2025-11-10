import { z } from "zod";

export const MessageDeleteSchema = z.object({
    messageId: z.string().min(1, "messageID is required"),
});

export type MessageDeleteDto = z.infer<typeof MessageDeleteSchema>;
