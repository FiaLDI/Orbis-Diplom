import { z } from "zod";

export const StartChatSchema = z.object({
    id: z.number().min(1, "UserID is required"),
    userId: z.number().min(1, "UserId is required"),
});

export type StartChatDto = z.infer<typeof StartChatSchema>;
