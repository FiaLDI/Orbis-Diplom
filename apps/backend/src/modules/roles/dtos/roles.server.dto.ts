import { z } from "zod";

export const RolesServerSchema = z.object({
    id: z.number().min(1, "UserID is required"),
    serverId: z.number().min(1, "ServerID is required"),
});

export type FRolesServerDto = z.infer<typeof RolesServerSchema>;
