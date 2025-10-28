import { z } from "zod";

const MIN_AGE = 13;
const MAX_AGE = 120;

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
  username: z
    .string()
    .min(3, "Username too short")
    .max(32, "Username too long"),
  birth_date: z
    .string()
    .refine((value) => {
      const d = new Date(value);
      if (isNaN(d.getTime())) return false;

      const now = new Date();
      const yearNow = now.getFullYear();
      const age = yearNow - d.getFullYear();

      return age >= MIN_AGE && age <= MAX_AGE;
    }, "Birth date is out of allowed range"),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
