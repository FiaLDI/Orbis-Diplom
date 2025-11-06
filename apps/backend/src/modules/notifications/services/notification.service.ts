import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { PrismaClient } from "@prisma/client";
import { NotificationType } from "../types/notification.types";
import { emitNotification } from "@/socket/notification";

@injectable()
export class NotificationService {
    constructor(@inject(TYPES.Prisma) private prisma: PrismaClient) {}

    async sendNotification(
        userId: number,
        options: {
            type: NotificationType;
            title: string;
            body?: string;
            data?: Record<string, any>;
            silent?: boolean;
        }
    ) {
        const notif = await this.prisma.notifications.create({
            data: {
                user_id: userId,
                type: options.type,
                title: options.title,
                body: options.body ?? null,
                data: options.data ? JSON.stringify(options.data) : null,
            },
        });

        if (!options.silent) {
            emitNotification(userId, notif);
        }
    }

    async getNotifications(id: number) {
        const notifications = await this.prisma.notifications.findMany({
            where: { user_id: id },
            orderBy: { created_at: "desc" },
            take: 50,
        });

        return notifications;
    }

    async markNotificationRead(id: number, notificationId: number) {
        await this.prisma.notifications.updateMany({
            where: { id: notificationId, user_id: id },
            data: { is_read: true },
        });

        return { message: `Success mark as read ${notificationId}` };
    }

    async deleteNotification(id: number, notificationId: number) {
        await this.prisma.notifications.deleteMany({
            where: { id: notificationId, user_id: id },
        });

        return { message: `Success delete ${notificationId}` };
    }

    async markAllNotificationRead(id: number) {
        await this.prisma.notifications.updateMany({
            where: { user_id: id },
            data: { is_read: true },
        });

        return { message: "Success mark as read all" };
    }

    async deleteAllNotification(id: number) {
        await this.prisma.notifications.deleteMany({
            where: { user_id: id },
        });

        return { message: "Success delete all" };
    }
}
