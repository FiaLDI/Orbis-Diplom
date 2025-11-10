import { z } from "zod";

export const StartChatSchema = z.object({
    id: z.string().min(1, "UserID is required"),
    userId: z.string().min(1, "UserId is required"),
});

export type StartChatDto = z.infer<typeof StartChatSchema>;
