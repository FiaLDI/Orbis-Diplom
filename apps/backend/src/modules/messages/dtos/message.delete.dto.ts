import { z } from "zod";

export const MessageDeleteSchema = z.object({
    messageId: z.number().min(1, "messageID is required"),
});

export type MessageDeleteDto = z.infer<typeof MessageDeleteSchema>;
