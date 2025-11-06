import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import type { AuthMiddleware } from "@/middleware/auth.middleware";
import { NotificationController } from "./controllers/notification.controller";

export const notificationModule = () => {
    const router = express.Router();

    const controller = container.get<NotificationController>(TYPES.NotificationController);
    const auth = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

    router.get("/", auth.handle.bind(auth), controller.getNotifications.bind(controller));
    router.put(
        "/:id/read",
        auth.handle.bind(auth),
        controller.markNotificationRead.bind(controller)
    );
    router.delete(
        "/:id",
        auth.handle.bind(auth),
        controller.markNotificationDelete.bind(controller)
    );
    router.put(
        "/read",
        auth.handle.bind(auth),
        controller.markAllNotificationRead.bind(controller)
    );
    router.delete(
        "/",
        auth.handle.bind(auth),
        controller.markAllNotificationDelete.bind(controller)
    );

    return router;
};
