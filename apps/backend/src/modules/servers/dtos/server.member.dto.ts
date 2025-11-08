import { z } from "zod";

export const ServerMemberSchema = z.object({
    id: z.string().min(1, "UserId is required"),
    serverId: z.string().min(1, "ServerID is required"),
    userId: z.string().min(1, "UserID is required"),
});

export type ServerMemberDto = z.infer<typeof ServerMemberSchema>;
