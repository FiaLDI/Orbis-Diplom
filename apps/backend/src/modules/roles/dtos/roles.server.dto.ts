import { z } from "zod";

export const RolesServerSchema = z.object({
    id: z.string().min(1, "UserID is required"),
    serverId: z.string().min(1, "ServerID is required"),
});

export type FRolesServerDto = z.infer<typeof RolesServerSchema>;
