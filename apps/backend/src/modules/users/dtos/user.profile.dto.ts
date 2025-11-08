import { z } from "zod";

export const GetUserProfileSchema = z.object({
    id: z.string().min(1, "UserID is required"),
});

export type UserProfileDto = z.infer<typeof GetUserProfileSchema>;
