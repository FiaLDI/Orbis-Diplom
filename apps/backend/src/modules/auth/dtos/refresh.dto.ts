import { z } from "zod";

export const RefreshSchema = z.object({
  refresh_token: z
    .string()
    .min(1, "Refresh token missing"),
});

export type RefreshDto = z.infer<typeof RefreshSchema>;
