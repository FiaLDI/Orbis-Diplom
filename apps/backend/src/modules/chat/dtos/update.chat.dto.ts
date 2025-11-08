import { z } from "zod";

export const UpdateChatSchema = z.object({
    id: z.string().min(1, "UserID is required"),
    chatId: z.string().min(1, "ChatId is required"),
    name: z.string().min(1, "Name is required"),
});

export type UpdateChatDto = z.infer<typeof UpdateChatSchema>;
