import { z } from "zod";

export const markNotificationSchema = z.object({
    id: z.number().min(1, "UserID is required"),
    notificationId: z.number().min(1, "NotificationID is required"),
});

export type markNotificationDto = z.infer<typeof markNotificationSchema>;
