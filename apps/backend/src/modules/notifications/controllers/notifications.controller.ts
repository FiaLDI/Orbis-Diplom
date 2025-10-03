import { Request, Response } from "express";
import { prisma } from "@/config";

// --- Получить список уведомлений ---
export const getNotifications = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const notifications = await prisma.notifications.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      take: 50,
    });

    res.json(notifications);
  } catch (err) {
    console.error("getNotifications error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Пометить уведомление как прочитанное ---
export const markNotificationRead = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);

    const notif = await prisma.notifications.updateMany({
      where: { id, user_id: userId },
      data: { read: true },
    });

    res.json({ message: "Notification marked as read", updated: notif.count });
  } catch (err) {
    console.error("markNotificationRead error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Удалить уведомление ---
export const deleteNotification = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);

    await prisma.notifications.deleteMany({
      where: { id, user_id: userId },
    });

    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("deleteNotification error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Подписка на Web Push ---
export const subscribePush = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ message: "Invalid subscription object" });
    }

    await prisma.push_subscriptions.upsert({
      where: { user_id_endpoint: { user_id: userId, endpoint } },
      update: { p256dh: keys.p256dh, auth: keys.auth },
      create: {
        user_id: userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    });

    res.json({ message: "Subscribed to push notifications" });
  } catch (err) {
    console.error("subscribePush error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Отписка от Web Push ---
export const unsubscribePush = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);

    await prisma.push_subscriptions.delete({
      where: { id },
    });

    res.json({ message: "Unsubscribed from push notifications" });
  } catch (err) {
    console.error("unsubscribePush error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
