import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { PrismaClient } from "@prisma/client";
import { emitServerBan, emitServerKick } from "@/utils/sendBan";
import { AuditLogsEntity } from "../entities/audit.logs.entity";
import { UserService } from "@/modules/users";
import { ServerService } from "@/modules/servers";
import { UserProfile } from "@/modules/users/entity/user.profile";
import { BansEntity } from "../entities/bans.moderation.entity";
import { ActionModerationDto } from "../dtos/action.moderation.dto";
import { NotificationService } from "@/modules/notifications";

@injectable()
export class ModerationService {
    constructor(
        @inject(TYPES.Prisma) private prisma: PrismaClient,
        @inject(TYPES.UserService) private userService: UserService,
        @inject(TYPES.ServerService) private serverService: ServerService,
        @inject(TYPES.NotificationService) private notificationService: NotificationService
    ) {}

    async getAuditLogs(serverId: string) {
        const whereClause = serverId ? { server_id: serverId } : {};

        const auditLogs = await this.prisma.audit_logs.findMany({
            where: whereClause,
            orderBy: { created_at: "desc" },
            take: 100,
        });

        const serverData = await this.serverService.getServer(serverId);
        const entity = new AuditLogsEntity(auditLogs, serverData);

        const ActorUserIds = entity.getActorIds().filter((id): id is string => id !== null);
        const TargetUserIds = entity.getTargetIds().filter((id): id is string => id !== null);

        if (ActorUserIds.length === 0) {
            return [];
        }

        if (TargetUserIds.length === 0) {
            return [];
        }

        const ActorProfiles = await Promise.all(
            ActorUserIds.map((id) => this.userService.getProfileById(id))
        );

        const TargetProfiles = await Promise.all(
            TargetUserIds.map((id) => this.userService.getProfileById(id))
        );

        const ActorProfilesMap = UserProfile.getUsersMap(ActorProfiles);
        const TargetProfilesMap = UserProfile.getUsersMap(TargetProfiles);

        return entity.toJSON(ActorProfilesMap, TargetProfilesMap);
    }

    async createAuditLog(
        serverId: string,
        actorId: string,
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

    async banUser({ serverId, userId, id, reason }: ActionModerationDto) {
        const existingBan = await this.prisma.server_bans.findUnique({
            where: { server_id_user_id: { server_id: serverId, user_id: userId } },
        });
        if (existingBan) throw new Error("User is already banned");

        const ban = await this.prisma.$transaction(async (tx) => {
            await tx.user_server_roles.deleteMany({
                where: { user_id: userId, server_id: serverId },
            });
            await tx.user_server.deleteMany({ where: { user_id: userId, server_id: serverId } });

            const banEntry = await tx.server_bans.create({
                data: {
                    server_id: serverId,
                    user_id: userId,
                    reason: reason || "No reason provided",
                    banned_by: id,
                },
            });

            await tx.audit_logs.create({
                data: {
                    server_id: serverId,
                    actor_id: id,
                    action: "BAN_ADD",
                    target_id: String(userId),
                    metadata: JSON.stringify({ reason }),
                },
            });

            return banEntry;
        });

        await this.notificationService.sendNotification(userId, {
            type: "system",
            title: `Вы были забанены на сервере`,
            body: `Администратор удалил вас с сервера. ${reason ? `Причина: ${reason}` : ""}`,
            data: { serverId },
        });

        emitServerBan(userId, serverId, reason);

        return ban;
    }

    async unbanUser({ serverId, userId, id, reason }: ActionModerationDto) {
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
                    actor_id: id,
                    action: "BAN_REMOVE",
                    target_id: String(userId),
                },
            });
        });

        await this.notificationService.sendNotification(userId, {
            type: "system",
            title: "Вы были разбанены",
            body: "Вы снова можете присоединиться к серверу.",
            data: { serverId },
        });

        emitServerKick(userId, serverId);

        return { message: "User unbanned and rejoined" };
    }

    async getBannedUsers(serverId: string) {
        const bans = await this.prisma.server_bans.findMany({
            where: { server_id: serverId },
            orderBy: { created_at: "desc" },
        });

        const serverData = await this.serverService.getServer(serverId);
        const entity = new BansEntity(bans, serverData);

        const ActorUserIds = entity.getActorIds().filter((id): id is string => id !== null);
        const TargetUserIds = entity.getTargetIds().filter((id): id is string => id !== null);

        if (ActorUserIds.length === 0) {
            return [];
        }

        if (TargetUserIds.length === 0) {
            return [];
        }

        const ActorProfiles = await Promise.all(
            ActorUserIds.map((id) => this.userService.getProfileById(id))
        );

        const TargetProfiles = await Promise.all(
            TargetUserIds.map((id) => this.userService.getProfileById(id))
        );

        const ActorProfilesMap = UserProfile.getUsersMap(ActorProfiles);
        const TargetProfilesMap = UserProfile.getUsersMap(TargetProfiles);

        return entity.toJSON(ActorProfilesMap, TargetProfilesMap);
    }

    async kickUser({ serverId, userId, id, reason }: ActionModerationDto) {
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
                    actor_id: id,
                    action: "KICK",
                    target_id: String(userId),
                },
            });
        });

        await this.notificationService.sendNotification(userId, {
            type: "server_kick",
            title: "Вы были исключены с сервера",
            body: "Администратор удалил вас с сервера.",
            data: { serverId },
        });

        return { message: "User kicked from server" };
    }
}
