import { z } from "zod";

export const FriendInviteSchema = z.object({
  id: z.number().min(1, "UserID is required"),
  toUserId: z.number().min(1, "ToUserId is required"),
});

export type FriendInviteDto = z.infer<typeof FriendInviteSchema>;
