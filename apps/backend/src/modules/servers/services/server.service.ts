import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { TYPES } from "@/di/types";
import type { Prisma, PrismaClient } from "@prisma/client";
import { RolesService } from "@/modules/roles/services/roles.service";
import { ServerJoinDto } from "../dtos/server.join.dto";
import { ServerInfoDto } from "../dtos/server.info.dto";
import { ChatService } from "@/modules/chat";
import { ServerInfo } from "../entities/server.info.entities";
import { ServerUpdateDto } from "../entities/server.update.dto";
import { Errors } from "@/common/errors";
import { ServerChatIdDto, ServerIdOnlyDto } from "../entities/server.chats.dto";
import { ServerMemberDto } from "../entities/server.member.dto";
import { UserService } from "@/modules/users";

@injectable()
export class ServerService {
    constructor(
        @inject(TYPES.Prisma) private prisma: PrismaClient,
        @inject(new LazyServiceIdentifier(() => TYPES.RolesService))
        private rolesService: RolesService,
        @inject(TYPES.ChatService) private chatService: ChatService,
        @inject(new LazyServiceIdentifier(() => TYPES.UserService))
        private userService: UserService
    ) {}

    async check(serverId: number, userId: number) {
        const existing = await this.prisma.user_server.findUnique({
            where: {
                user_id_server_id: {
                    user_id: userId,
                    server_id: serverId,
                },
            },
        });

        return existing;
    }

    async getServer(serverId: number) {
        const server = await this.prisma.servers.findFirst({
            select: {
                id: true,
                name: true,
            },
            where: {
                id: serverId,
            },
        });

        return server;
    }

    async getUserServers(id: number) {
        const servers = await this.prisma.servers.findMany({
            where: {
                user_server: {
                    some: {
                        user_id: id,
                    },
                },
            },
            distinct: ["id"],
            select: {
                id: true,
                name: true,
                avatar_url: true,
            },
        });

        return servers;
    }

    async createServerUser(creatorId: number, name: string) {
        await this.prisma.$transaction(async (tx) => {
            const server = await this.createServer(tx, creatorId, name);
            await this.connectToServer(tx, server.id, creatorId);
            await this.rolesService.createCreatorServerRole(tx, server.id, creatorId);
            await this.rolesService.createDefaultServerRole(tx, server.id, creatorId);

            return server;
        });

        return { message: "Success" };
    }

    async joinServerUser({ id, serverId }: ServerJoinDto) {
        await this.prisma.$transaction(async (tx) => {
            await this.connectToServer(tx, serverId, id);
            await this.rolesService.assignDefaultRoleUser(tx, id, serverId);
        });

        return { message: "Success" };
    }

    async getServerInfo({ serverId }: ServerInfoDto) {
        const server = await this.prisma.servers.findUnique({
            where: { id: serverId },
        });

        const serverInfo = new ServerInfo({ servers: server });

        return serverInfo;
    }

    private async connectToServer(tx: Prisma.TransactionClient, serverId: number, userId: number) {
        await tx.user_server.create({
            data: {
                user_id: userId,
                server_id: serverId,
                created_at: new Date(),
            },
        });

        return { message: "Success" };
    }

    private async createServer(tx: Prisma.TransactionClient, userId: number, name: string) {
        const server = await tx.servers.create({
            data: {
                creator_id: userId,
                name,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return server;
    }

    async updateServer(dto: ServerUpdateDto) {
        const server = await this.prisma.servers.findUnique({ where: { id: dto.serverId } });
        if (!server) return Errors.notFound("Server not found");

        if (server.creator_id !== dto.id) return Errors.conflict("Forbidden");

        const updated = await this.prisma.servers.update({
            where: { id: dto.serverId },
            data: {
                name: dto.name ?? server.name,
                avatar_url: dto.avatar_url ?? server.avatar_url ?? null,
                updated_at: new Date(),
            },
        });
        return { id: updated.id, name: updated.name, avatar_url: updated.avatar_url };
    }

    async deleteServer(dto: ServerIdOnlyDto) {
        const server = await this.prisma.servers.findUnique({ where: { id: dto.serverId } });
        if (!server) return Errors.notFound("Server not found");
        if (server.creator_id !== dto.id) return Errors.conflict("Forbidden");

        await this.prisma.$transaction(async (tx) => {
            await this.rolesService.cleanServerRoles(tx, dto.serverId);
            await tx.user_server.deleteMany({ where: { server_id: dto.serverId } });
            await this.chatService.cleanServerChats(tx, dto.serverId);
            await tx.server_bans.deleteMany({ where: { server_id: dto.serverId } });
            await tx.invites.deleteMany({ where: { server_id: dto.serverId } });
            await tx.audit_logs.deleteMany({ where: { server_id: dto.serverId } });
            await tx.reports.deleteMany({ where: { server_id: dto.serverId } });

            await tx.project_issues.deleteMany({
                where: {
                    project: { server_id: dto.serverId },
                },
            });

            await tx.issue_assignee.deleteMany({
                where: {
                    issue: {
                        project_issues: {
                            some: { project: { server_id: dto.serverId } },
                        },
                    },
                },
            });

            await tx.chat_issues.deleteMany({
                where: {
                    issue: {
                        project_issues: {
                            some: { project: { server_id: dto.serverId } },
                        },
                    },
                },
            });

            await tx.issue.deleteMany({
                where: {
                    project_issues: {
                        some: { project: { server_id: dto.serverId } },
                    },
                },
            });

            await tx.project.deleteMany({
                where: { server_id: dto.serverId },
            });

            await tx.servers.delete({ where: { id: dto.serverId } });
        });

        return { message: "Server and related data deleted" };
    }

    async kickMember(dto: ServerMemberDto) {
        await this.prisma.user_server.delete({
            where: { user_id_server_id: { user_id: dto.userId, server_id: dto.serverId } },
        });
        return { message: "Member kicked" };
    }

    async banMember(dto: ServerMemberDto) {
        const server = await this.prisma.servers.findUnique({ where: { id: dto.serverId } });
        if (!server) return Errors.notFound("Server not found");

        await this.prisma.server_bans.create({
            data: {
                server_id: dto.serverId,
                user_id: dto.userId,
                banned_by: dto.id,
                created_at: new Date(),
            },
        });

        await this.prisma.user_server.deleteMany({
            where: { server_id: dto.serverId, user_id: dto.userId },
        });

        return { message: "User banned" };
    }

    async unbanMember(dto: ServerMemberDto) {
        await this.prisma.server_bans.delete({
            where: { server_id_user_id: { server_id: dto.serverId, user_id: dto.userId } },
        });
        return { message: "User unbanned" };
    }

    async getServerMembers({ serverId }: { serverId: number }) {
        const members = await this.prisma.user_server.findMany({
            where: { server_id: serverId },
            select: { user_id: true },
        });

        const rolesData = await this.rolesService.getServerMembers(serverId);
        const rolesMap = new Map<number, any>(rolesData.map((r) => [r.user_id, r.roles]));

        const result = [];
        for (const member of members) {
            const profile = await this.userService.getProfileById(member.user_id);

            result.push({
                id: member.user_id,
                username: profile?.toPublicJSON().username ?? "Unknown",
                avatar_url: profile?.toPublicJSON().avatar_url ?? null,
                about: profile?.toPublicJSON().about ?? "",
                roles: rolesMap.get(member.user_id) ?? [],
            });
        }

        return result;
    }

    async getServerChats(dto: ServerIdOnlyDto) {
        return this.chatService.listServerChats(dto.serverId);
    }

    async createChat(dto: ServerIdOnlyDto) {
        return this.chatService.createServerChat(dto.serverId, dto.id, "default chat");
    }

    async getChatInfo(dto: ServerChatIdDto) {
        return this.chatService.getChatInfo({
            id: dto.id,
            serverId: dto.serverId,
            chatId: dto.chatId,
        });
    }

    async deleteChat(dto: ServerChatIdDto) {
        return await this.chatService.deleteServerChat({
            id: dto.id,
            serverId: dto.serverId,
            chatId: dto.chatId,
        });
    }
}
