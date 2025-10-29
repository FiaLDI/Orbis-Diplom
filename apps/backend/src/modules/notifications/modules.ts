import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { NotificationController } from "./controllers/notification.controller";
import { AuthMiddleware } from "@/middleware/auth.middleware";

const controller = container.get<NotificationController>(TYPES.NotificationController);
const auth = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
export const notificationModule = express.Router();

notificationModule.get("/", auth.handle.bind(auth), controller.getNotifications.bind(controller));
notificationModule.put("/:id/read", auth.handle.bind(auth), controller.markNotificationRead.bind(controller));
notificationModule.delete("/:id", auth.handle.bind(auth),  controller.markNotificationDelete.bind(controller));
notificationModule.put("/read", auth.handle.bind(auth), controller.markAllNotificationRead.bind(controller));
notificationModule.delete("/", auth.handle.bind(auth),  controller.markAllNotificationDelete.bind(controller));
