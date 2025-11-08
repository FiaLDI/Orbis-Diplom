import { z } from "zod";

export const RolesDeleteSchema = z.object({
    id: z.string().min(1, "UserID is required"),
    roleId: z.string().min(1, "RoleId is required"),
    serverId: z.string().min(1, "ServerId is required"),
});

export type RolesDeleteDto = z.infer<typeof RolesDeleteSchema>;
