import { z } from "zod";

export const RolesUpdateSchema = z.object({
    id: z.string().min(1, "UserID is required"),
    roleId: z.string().min(1, "RoleId is required"),
    serverId: z.string().min(1, "ServerId is required"),
    name: z.string().min(1, "Name is required"),
    color: z.string().min(1, "Color is required"),
    permissions: z
        .array(z.object({ name: z.string(), id: z.number() }))
        .nullable()
        .optional(),
});

export type RolesUpdateDto = z.infer<typeof RolesUpdateSchema>;
