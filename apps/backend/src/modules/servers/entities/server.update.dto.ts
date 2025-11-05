import { z } from "zod";

export const ServerUpdateSchema = z.object({
  id: z.number().int().positive(),
  serverId: z.number().int().positive(),
  name: z.string().min(1).max(128).optional(),
  avatar_url: z.string().url().optional(),
});

export type ServerUpdateDto = z.infer<typeof ServerUpdateSchema>;
