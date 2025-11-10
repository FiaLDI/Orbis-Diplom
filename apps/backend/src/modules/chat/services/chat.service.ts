import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { Prisma, PrismaClient } from "@prisma/client";
import { Errors } from "@/common/errors";
import { Chat } from "../entities/chat.entities";
import { ServerChatIdDto } from "@/modules/servers/dtos/server.chats.dto";

@injectable()
export class ChatService {
    constructor(@inject(TYPES.Prisma) private prisma: PrismaClient) {}

    async getUsersChat(id: string) {
        const chats = await this.prisma.chats.findMany({
            where: {
                chat_users: {
                    some: { user_id: id },
                },
            },
            include: {
                chat_users: true,
            },
        });

        const chatInfo = new Chat({ userChat: chats });

        return chatInfo;
    }

    async getServerChat(serverId: string) {
        const chats = await this.prisma.chats.findMany({
            where: {
                server_chats: {
                    some: { id_server: serverId },
                },
            },
            include: {
                server_chats: true,
            },
        });

        const chatInfo = new Chat({ serverChat: chats });

        return chatInfo;
    }

    async updateChat(chatId: string, name: string) {
        const chat = await this.prisma.chats.update({
            where: { id: chatId },
            data: { name },
        });
        return chat;
    }

    async deleteChat(chatId: string) {
        await this.prisma.chat_users.deleteMany({
            where: { chat_id: chatId },
        });

        await this.prisma.chats.delete({ where: { id: chatId } });
        return { message: "Deleted" };
    }

    async startChat(id: string, userId: string) {
        if (id === userId) {
            return Errors.conflict("Cannot start chat with yourself");
        }

        const [u1, u2] = await Promise.all([
            this.prisma.users.findUnique({
                where: { id },
                select: { username: true }
            }),
            this.prisma.users.findUnique({
                where: { id: userId },
                select: { username: true }
            })
        ]);

        if (!u1 || !u2) {
            return Errors.notFound("User not found");
        }
        const existingChat = await this.prisma.chats.findFirst({
            where: {
                chat_users: {
                    some: { user_id: id }
                },
                AND: {
                    chat_users: {
                        some: { user_id: userId }
                    }
                }
            },
            select: { id: true }
        });

        if (existingChat) {
            return Errors.conflict("Chat already exists");
        }

        const chat = await this.prisma.$transaction(async (tx) => {
            const createdChat = await tx.chats.create({
                data: {
                    name: `${u1.username}, ${u2.username}`,
                    creator_id: id,
                    created_at: new Date(),
                },
            });

            await tx.chat_users.createMany({
                data: [
                    { user_id: id, chat_id: createdChat.id },
                    { user_id: userId, chat_id: createdChat.id },
                ],
            });

            return createdChat;
        });

        return chat.id;
    }

    async cleanServerChats(tx: Prisma.TransactionClient, serverId: string) {
        await tx.server_chats.deleteMany({ where: { id_server: serverId } });
        await tx.chats.deleteMany({ where: { server_chats: { some: { id_server: serverId } } } });
    }

    async listServerChats(serverId: string) {
        const chats = await this.prisma.chats.findMany({
            where: { server_chats: { some: { id_server: serverId } } },
            select: { id: true, name: true, created_at: true },
        });
        return chats;
    }

    async createServerChat(serverId: string, creatorId: string, name = "default chat") {
        const chat = await this.prisma.$transaction(async (tx) => {
            const createdChat = await tx.chats.create({
                data: {
                    name,
                    creator_id: creatorId,
                    created_at: new Date(),
                    server_chats: {
                        create: { id_server: serverId },
                    },
                },
            });
            return createdChat;
        });

        return { message: "Chat created", chat };
    }

    async getChatInfo({ chatId }: ServerChatIdDto) {
        const chat = await this.prisma.chats.findUnique({
            where: { id: chatId },
            include: {
                chat_users: {
                    include: {
                        users: { select: { id: true, username: true } },
                    },
                },
            },
        });

        if (!chat) throw Errors.notFound("Chat not found");
        return chat;
    }

    async deleteServerChat({ serverId, chatId }: ServerChatIdDto) {
        const chat = await this.prisma.chats.findUnique({ where: { id: chatId } });
        if (!chat) throw Errors.notFound("Chat not found");

        await this.prisma.$transaction(async (tx) => {
            await tx.server_chats.delete({
                where: {
                    id_server_id_chats: { id_server: serverId, id_chats: chatId },
                },
            });
            await tx.chats.delete({ where: { id: chatId } });
        });

        return { message: "Chat deleted" };
    }

    async getChatsByIds(ids: string[]) {
        return await this.prisma.chats.findMany({
            where: { id: { in: ids } },
            select: { id: true, name: true, created_at: true },
        });
    }

    async createIssueChat(name: string) {
        return await this.prisma.chats.create({
            data: {
                name,
                created_at: new Date(),
            },
        });
    }
}
