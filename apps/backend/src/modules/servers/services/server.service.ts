import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { TYPES } from "@/di/types";
import type { Prisma, PrismaClient } from "@prisma/client";
import { RolesService } from "@/modules/roles/services/roles.service";
import { ServerJoinDto } from "../dtos/server.join.dto";
import { ServerInfoDto } from "../dtos/server.info.dto";
import { ChatService } from "@/modules/chat";
import { ServerInfo } from "../entities/server.info.entities";

@injectable()
export class ServerService {
    constructor(
        @inject(TYPES.Prisma) private prisma: PrismaClient,
        @inject(new LazyServiceIdentifier(() => TYPES.RolesService))
        private rolesService: RolesService,
        @inject(TYPES.ChatService) private chatService: ChatService
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

        return existing
    }

    async getServer(serverId: number) {
        const server = await this.prisma.servers.findFirst({
            select: {
                id: true,
                name: true,
            },
            where: {
                id: serverId
            }
        })

        return server
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

        return servers
    }
    
    async createServerUser(creatorId: number, name: string) {
        await this.prisma.$transaction(async (tx) => {
            const server = await this.createServer(tx, creatorId, name);
            await this.connectToServer(tx, server.id, creatorId);
            await this.rolesService.createCreatorServerRole(tx, server.id, creatorId);
            await this.rolesService.createDefaultServerRole(tx, server.id, creatorId);

            return server;
        });

        return { message: "Success" }
    }

    async joinServerUser({id, serverId}: ServerJoinDto) {
        await this.prisma.$transaction(async (tx) => {
            await this.connectToServer(tx, serverId, id);
            await this.rolesService.assignDefaultRoleUser(tx, id, serverId);
        });

        return { message: "Success" }
    }

    async getServerInfo({serverId}: ServerInfoDto) {
        const server = await this.prisma.servers.findUnique({
            where: { id: serverId },
        });

        const chats = await this.chatService.getServerChat(serverId)

        const serverInfo = new ServerInfo({chats, servers: server})

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

        return { message: "Success" }
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

        return server
    }
}
