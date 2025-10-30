import { z } from "zod";

export const getNotificationSchema = z.object({
    id: z.number().min(1, "UserID is required"),
});

export type getNotificationDto = z.infer<typeof getNotificationSchema>;
