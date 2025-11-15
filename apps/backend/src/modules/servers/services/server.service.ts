import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { TYPES } from "@/di/types";
import type { Prisma, PrismaClient } from "@prisma/client";
import { RolesService } from "@/modules/roles/services/roles.service";
import { ServerJoinDto } from "../dtos/server.join.dto";
import { ServerInfoDto } from "../dtos/server.info.dto";
import { ChatService } from "@/modules/chat";
import { ServerInfo } from "../entities/server.info.entities";
import { ServerUpdateDto } from "../dtos/server.update.dto";
import { Errors } from "@/common/errors";
import { ServerChatIdDto, ServerIdOnlyDto } from "../dtos/server.chats.dto";
import { ServerMemberDto } from "../dtos/server.member.dto";
import { UserService } from "@/modules/users";
import { ServerCreateLinkDto, ServerDeleteLinkDto } from "../dtos/server.link.dto";
import { v7 as uuidv7 } from "uuid";

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

    async check(serverId: string, userId: string) {
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

    private async checkInside(tx: Prisma.TransactionClient, serverId: string, userId: string) {
        const existing = await tx.user_server.findUnique({
            where: {
                user_id_server_id: {
                    user_id: userId,
                    server_id: serverId,
                },
            },
        });

        return existing;
    }

    async getServer(serverId: string) {
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

    async getUserServers(id: string) {
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

    async createServerUser(creatorId: string, name: string) {
        await this.prisma.$transaction(async (tx) => {
            const server = await this.createServer(tx, creatorId, name);
            await this.connectToServer(tx, server.id, creatorId);
            await this.rolesService.createCreatorServerRole(tx, server.id, creatorId);
            await this.rolesService.createDefaultServerRole(tx, server.id, creatorId);

            return server;
        });

        return { message: "Success" };
    }

    async joinServerUser({ id, code }: ServerJoinDto) {
        await this.prisma.$transaction(async (tx) => {
            const link = await this.getInviteLinkByCode(tx, code);

            if (!link) throw Errors.conflict("Non correct invite link");;

            const check = await this.checkInside(tx, link.server_id, id);

            if (check) {
                throw Errors.conflict("User already joined this server");
            }

            if (!link.max_uses) throw Errors.conflict("Max uses");

            if ((link.max_uses - link.uses) <= 0) throw Errors.conflict("Max uses");

            await this.useInviteLink(tx, { code: code, uses: link.uses})
            await this.connectToServer(tx, link.server_id, id);
            await this.rolesService.assignDefaultRoleUser(tx, id, link.server_id);
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

    private async connectToServer(tx: Prisma.TransactionClient, serverId: string, userId: string) {
        await tx.user_server.create({
            data: {
                user_id: userId,
                server_id: serverId,
                created_at: new Date(),
            },
        });

        return { message: "Success" };
    }

    private async createServer(tx: Prisma.TransactionClient, userId: string, name: string) {
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

    async getServerMembers({ serverId }: { serverId: string }) {
        const members = await this.prisma.user_server.findMany({
            where: { server_id: serverId },
            select: { user_id: true },
        });

        const rolesData = await this.rolesService.getServerMembers(serverId);
        const rolesMap = new Map<string, any>(rolesData.map((r) => [r.user_id, r.roles]));

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

    async createInviteLink(dto: ServerCreateLinkDto) {
        const link = await this.prisma.invites.create({
            data: {
                code: uuidv7().slice(15, 23),
                expires_at: new Date(30),
                creator_id: dto.id,
                max_uses: 10,
                uses: 0,
                server_id: dto.serverId
            },
        })

        return link.code
    }

    async deleteInviteLink(dto: ServerDeleteLinkDto) {
        await this.prisma.invites.deleteMany({
            where: {
                code: dto.code,
                server_id: dto.serverId
            }
        })

        return { message: "Succsess"}
    }

    async getInviteLink(dto: ServerCreateLinkDto) {
        const links = await this.prisma.invites.findMany({
            where: {
                server_id: dto.serverId
            }
        })

        return links
    }

    private async getInviteLinkByCode(tx: Prisma.TransactionClient, code: string) {
        const link = await tx.invites.findFirst({
            where: {
                code: code
            }
        })

        return link
    }

    private async useInviteLink(tx: Prisma.TransactionClient, link: {
        code: string;
        uses: number;
    }) {
        await tx.invites.update({
            where: { code: link?.code },
            data: {
                uses: link.uses + 1
            },
        })
    }
}
