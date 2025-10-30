import { prisma } from "@/config";
import { emitNotification } from "@/socket/notification";

/**
 * Универсальный хелпер для создания и отправки уведомлений.
 *
 * @param userId - ID пользователя, которому отправляем уведомление
 * @param options - параметры уведомления
 */
export const sendNotification = async (
    userId: number,
    options: {
        type: NotificationType;
        title: string;
        body?: string;
        data?: Record<string, any>;
        silent?: boolean;
    }
) => {
    try {
        const notif = await prisma.notifications.create({
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

        return notif;
    } catch (err) {
        console.error("sendNotification error:", err);
        throw err;
    }
};

export type NotificationType =
    | "friend_request"
    | "friend_accept"
    | "friend_reject"
    | "friend_remove"
    | "server_invite"
    | "server_kick"
    | "message_mention"
    | "assign_role"
    | "remove_role"
    | "system";
