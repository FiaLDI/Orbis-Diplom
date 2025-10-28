import { z } from "zod";

export const SendCodeSchema = z.object({
  email: z
    .string()
    .email("Valid email is required"),
});

export type SendCodeDto = z.infer<typeof SendCodeSchema>;
