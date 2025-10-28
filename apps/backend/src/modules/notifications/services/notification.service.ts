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
}
