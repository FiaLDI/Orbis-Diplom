import { z } from "zod";

export const AuditModerationSchema = z.object({
    id: z.number().min(1, "UserID is required"),
    serverId: z.number().min(1, "ServerId is required"),
});

export type AuditModerationDto = z.infer<typeof AuditModerationSchema>;
