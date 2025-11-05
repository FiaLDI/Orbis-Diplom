import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { PrismaClient } from "@prisma/client";
import { sendNotification } from "@/utils/sendNotification";
import { emitServerBan, emitServerKick } from "@/utils/sendBan";

@injectable()
export class ModerationService {
    constructor(@inject(TYPES.Prisma) private prisma: PrismaClient) {}

    /* =======================
       AUDIT LOGS
    ======================= */
    async getAuditLogs(serverId?: number) {
        const whereClause = serverId ? { server_id: serverId } : {};
        return this.prisma.audit_logs.findMany({
            where: whereClause,
            include: {
                actor: { select: { id: true, username: true } },
                server: { select: { id: true, name: true } },
            },
            orderBy: { created_at: "desc" },
            take: 100,
        });
    }

    async createAuditLog(
        serverId: number,
        actorId: number,
        action: string,
        targetId?: string,
        metadata?: any
    ) {
        await this.prisma.audit_logs.create({
            data: {
                server_id: serverId,
                actor_id: actorId,
                action,
                target_id: targetId,
                metadata: metadata ? JSON.stringify(metadata) : undefined,
            },
        });
    }

    /* =======================
       BANS
    ======================= */
    async banUser(serverId: number, userId: number, actorId: number, reason?: string) {
        const existingBan = await this.prisma.server_bans.findUnique({
            where: { server_id_user_id: { server_id: serverId, user_id: userId } },
        });
        if (existingBan) throw new Error("User is already banned");

        const ban = await this.prisma.$transaction(async (tx) => {
            // удалить все роли и связь с сервером
            await tx.user_server_roles.deleteMany({
                where: { user_id: userId, server_id: serverId },
            });
            await tx.user_server.deleteMany({ where: { user_id: userId, server_id: serverId } });

            // добавить бан
            const banEntry = await tx.server_bans.create({
                data: {
                    server_id: serverId,
                    user_id: userId,
                    reason: reason || "No reason provided",
                    banned_by: actorId,
                },
            });

            // лог
            await tx.audit_logs.create({
                data: {
                    server_id: serverId,
                    actor_id: actorId,
                    action: "BAN_ADD",
                    target_id: String(userId),
                    metadata: JSON.stringify({ reason }),
                },
            });

            return banEntry;
        });

        await sendNotification(userId, {
            type: "system",
            title: `Вы были забанены на сервере`,
            body: `Администратор удалил вас с сервера. ${reason ? `Причина: ${reason}` : ""}`,
            data: { serverId },
        });

        emitServerBan(userId, serverId, reason);

        return ban;
    }

    async unbanUser(serverId: number, userId: number, actorId: number) {
        await this.prisma.$transaction(async (tx) => {
            await tx.server_bans.delete({
                where: { server_id_user_id: { server_id: serverId, user_id: userId } },
            });

            const defaultRole = await tx.role_server.findFirst({
                where: { server_id: serverId, name: "default" },
            });

            await tx.user_server.create({
                data: {
                    user_id: userId,
                    server_id: serverId,
                    roles: defaultRole ? { create: [{ role_id: defaultRole.id }] } : undefined,
                },
            });

            await tx.audit_logs.create({
                data: {
                    server_id: serverId,
                    actor_id: actorId,
                    action: "BAN_REMOVE",
                    target_id: String(userId),
                },
            });
        });

        await sendNotification(userId, {
            type: "system",
            title: "Вы были разбанены",
            body: "Вы снова можете присоединиться к серверу.",
            data: { serverId },
        });

        emitServerKick(userId, serverId);

        return { message: "User unbanned and rejoined" };
    }

    async getBannedUsers(serverId: number) {
        return this.prisma.server_bans.findMany({
            where: { server_id: serverId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        user_profile: { select: { avatar_url: true, is_online: true } },
                    },
                },
            },
            orderBy: { created_at: "desc" },
        });
    }

    /* =======================
       KICKS
    ======================= */
    async kickUser(serverId: number, userId: number, actorId: number) {
        await this.prisma.$transaction(async (tx) => {
            await tx.user_server_roles.deleteMany({
                where: { user_id: userId, server_id: serverId },
            });

            await tx.user_server.delete({
                where: { user_id_server_id: { user_id: userId, server_id: serverId } },
            });

            await tx.audit_logs.create({
                data: {
                    server_id: serverId,
                    actor_id: actorId,
                    action: "KICK",
                    target_id: String(userId),
                },
            });
        });

        await sendNotification(userId, {
            type: "server_kick",
            title: "Вы были исключены с сервера",
            body: "Администратор удалил вас с сервера.",
            data: { serverId },
        });

        return { message: "User kicked from server" };
    }
}
