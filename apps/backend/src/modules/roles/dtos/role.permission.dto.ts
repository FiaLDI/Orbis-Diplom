import { z } from "zod";

export const RolesPermissionSchema = z.object({
    id: z.number().min(1, "UserID is required"),
    roleId: z.number().min(1, "RoleID is required"),
});

export type RolesPermissionDto = z.infer<typeof RolesPermissionSchema>;
