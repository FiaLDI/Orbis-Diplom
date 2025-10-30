import { z } from "zod";

export const GetUserProfileSchema = z.object({
    id: z.number().min(1, "UserID is required"),
});

export type UserProfileDto = z.infer<typeof GetUserProfileSchema>;
