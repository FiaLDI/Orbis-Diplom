import { z } from "zod";

export const RolesAssignSchema = z.object({
    roleId: z.number().min(1, "RoleId is required"),
    serverId: z.number().min(1, "ServerId is required"),
    userId: z.number().min(1, "UserId is required"),
});

export type RolesAssignDto = z.infer<typeof RolesAssignSchema>;
