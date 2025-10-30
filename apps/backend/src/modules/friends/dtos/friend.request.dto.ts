import { z } from "zod";

export const FriendRequestsSchema = z.object({
    id: z.number().min(1, "UserID is required"),
    direction: z.enum(["incoming", "outcoming"], {
        message: "Invalid direction param",
    }),
});

export type FriendRequestsDto = z.infer<typeof FriendRequestsSchema>;
