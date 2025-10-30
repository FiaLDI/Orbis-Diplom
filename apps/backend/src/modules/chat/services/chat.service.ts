import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { PrismaClient } from "@prisma/client";
import { Errors } from "@/common/errors";

@injectable()
export class ChatService {
    constructor(@inject(TYPES.Prisma) private prisma: PrismaClient) {}

    async getUsersChat(id: number) {
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

        return chats;
    }

    async updateChat(id: number, chatId: number, name: string) {
        const chat = await this.prisma.chats.update({
            where: { id: chatId },
            data: { name },
        });
        return chat;
    }

    async deleteChat(id: number, chatId: number) {
        await this.prisma.chat_users.deleteMany({
            where: { chat_id: chatId },
        });

        await this.prisma.chats.delete({ where: { id: chatId } });
        return { message: "Deleted" };
    }

    async startChat(id: number, userId: number) {
        const existingChat = await this.prisma.$queryRaw<
            { chat_id: number; u1: string; u2: string }[]
        >`
            SELECT cu1.chat_id, u1.username as u1, u2.username as u2
            FROM chat_users cu1
            JOIN chat_users cu2 ON cu1.chat_id = cu2.chat_id
            JOIN users u1 ON u1.id = cu1.user_id
            JOIN users u2 ON u2.id = cu2.user_id
            WHERE cu1.user_id = ${Number(id)} AND cu2.user_id = ${userId}
        `;

        const u1 = await this.prisma.users.findUnique({
            where: { id: Number(id) },
            select: { username: true },
        });

        const u2 = await this.prisma.users.findUnique({
            where: { id: Number(userId) },
            select: { username: true },
        });

        if (!u1 || !u2) {
            return Errors.notFound("User not found");
        }

        if (existingChat.length > 0) {
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
                    { user_id: Number(userId), chat_id: createdChat.id },
                ],
            });

            return createdChat;
        });

        return chat.id;
    }
}
