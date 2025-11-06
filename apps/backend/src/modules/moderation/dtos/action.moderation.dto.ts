import { z } from "zod";

export const ActionModerationSchema = z.object({
    id: z.number().min(1, "UserID is required"),
    userId: z.number().min(1, "UserId is required"),
    serverId: z.number().min(1, "ServerId is required"),
    reason: z.string().optional()
});

export type ActionModerationDto = z.infer<typeof ActionModerationSchema>;
