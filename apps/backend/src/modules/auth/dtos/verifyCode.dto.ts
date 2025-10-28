import { z } from "zod";

export const VerifyCodeSchema = z.object({
  email: z.string().email("Valid email is required"),
  code: z
    .string()
    .min(1, "Code is required")
    .regex(/^\d+$/, "Code must be numeric"),
});

export type VerifyCodeDto = z.infer<typeof VerifyCodeSchema>;
