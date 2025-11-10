import { z } from "zod";

export const DeleteChatSchema = z.object({
    id: z.string().min(1, "UserID is required"),
    chatId: z.string().min(1, "ChatId is required"),
});

export type DeleteChatDto = z.infer<typeof DeleteChatSchema>;
