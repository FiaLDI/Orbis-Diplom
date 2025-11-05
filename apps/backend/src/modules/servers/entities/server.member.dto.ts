import { z } from "zod";

export const ServerMemberSchema = z.object({
  id: z.number().int().positive(),
  serverId: z.number().int().positive(),
  userId: z.number().int().positive(),
});

export type ServerMemberDto = z.infer<typeof ServerMemberSchema>;
