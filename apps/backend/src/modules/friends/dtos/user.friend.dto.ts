import { z } from "zod";

export const UserFriendSchema = z.object({
    id: z.string().min(1, "UserID is required"),
});

export type UserFriendDto = z.infer<typeof UserFriendSchema>;
