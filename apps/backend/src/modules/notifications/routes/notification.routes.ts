import { Router } from "express";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
  subscribePush,
  unsubscribePush,
} from "../controllers/notifications.controller";
import { authenticate } from "@/modules/auth";

export const notificationRouter = Router();

notificationRouter.get("/", authenticate, getNotifications);
notificationRouter.post("/read/:id", authenticate, markNotificationRead);
notificationRouter.delete("/:id", authenticate, deleteNotification);

// Web Push
notificationRouter.post("/subscribe", authenticate, subscribePush);
notificationRouter.delete("/unsubscribe/:id", authenticate, unsubscribePush);
