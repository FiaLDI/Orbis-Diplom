import { z } from "zod";

export const AuditModerationSchema = z.object({
    id: z.string().min(1, "UserID is required"),
    serverId: z.string().min(1, "ServerId is required"),
});

export type AuditModerationDto = z.infer<typeof AuditModerationSchema>;
