import { z } from "zod";

export const RolesPermissionSchema = z.object({
    id: z.string().min(1, "UserID is required"),
    roleId: z.string().min(1, "RoleID is required"),
});

export type RolesPermissionDto = z.infer<typeof RolesPermissionSchema>;
