import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { Prisma, PrismaClient } from "@prisma/client";
import { MessageHistoryDto } from "../dtos/message.history.dto";
import { UserService } from "@/modules/users";
import { MessageListEntity } from "../entity/message.list.entity";
import { UserProfile } from "@/modules/users/entity/user.profile";
import { MessageSendDto } from "../dtos/message.send.dto";
import { v4 as uuidv4 } from "uuid";
import { MessageItemEntity } from "../entity/message.item.entity";
import { emitTo } from "@/socket/registry";
import { MessageCheckEntity } from "../entity/message.check.entity";
import { MessageEditDto } from "../dtos/message.edit.dto";
import { MessageContentDto } from "../dtos/message.content.dto";
import { Errors } from "@/common/errors";

@injectable()
export class MessageService {
    constructor(
        @inject(TYPES.Prisma) private prisma: PrismaClient,
        @inject(TYPES.UserService) private userService: UserService
    ) {}

    async checkMessage(messageId: string) {
        const message = await this.prisma.messages.findUnique({
            where: { id: messageId },
            select: { user_id: true, chat_id: true },
        });

        const entity = new MessageCheckEntity(message);

        return {
            check: entity.boolean(),
            checkData: entity.toJSON(),
        };
    }

    async getMessageById(messageId: string) {
        const message = await this.prisma.messages.findUnique({
            where: { id: messageId },
            include: {
                messages_content: {
                    include: {
                        content: { select: { id: true, text: true, url: true } },
                    },
                },
            },
        });

        if (!message) {
            throw Errors.notFound(`Message with id ${messageId} not found`);
        }

        if (!message.user_id) {
            throw Errors.notFound(`User with id ${message.user_id} not found`);
        }

        const profile = await this.userService.getProfileById(message.user_id);

        if (!profile) {
            throw Errors.notFound(`Profile for user ${message.user_id} not found`);
        }

        const entity = new MessageItemEntity(
            message,
            profile,
            message.messages_content.map((mc) => ({
                id: mc.content.id,
                type: mc.type ?? "text",
                text: mc.content.text ?? null,
                url: mc.content.url ?? null,
                size: mc.size ?? null,
                uploaded_at: mc.uploaded_at,
            }))
        );

        return entity.toJSON();
    }

    async getMessages({ chatId, cursor }: { chatId: string; cursor?: string }) {
        const messages = await this.prisma.messages.findMany({
            where: { chat_id: chatId },
            orderBy: { created_at: "desc" },
            take: 20,
            skip: cursor ? 1 : 0,
            ...(cursor && { cursor: { id: cursor } }),
            include: {
            messages_content: {
                include: {
                content: { select: { id: true, text: true, url: true } },
                },
            },
            },
        });

        const messageList = new MessageListEntity(messages.reverse());
        const userIds = messageList.getUserIds().filter((id): id is string => id !== null);

        if (!userIds.length) return [];

        const profiles = await Promise.all(
            userIds.map((id) => this.userService.getProfileById(id))
        );
        const profilesMap = UserProfile.getUsersMap(profiles);

        return messageList.toJSON(profilesMap);
        }



    async createMessage(
        id: string,
        chatId: string,
        contentsRow: MessageSendDto["content"],
        replyToId?: string | undefined
    ) {
        const message = await this.prisma.messages.create({
            data: {
                chat_id: chatId,
                user_id: id,
                reply_to_id: replyToId ?? null,
                is_edited: false,
                created_at: new Date(),
                messages_content: {
                    create: contentsRow.map((content) => ({
                        id_content: content.id,
                        type: content.type,
                        uploaded_at: new Date(),
                        size: null,
                    })),
                },
            },
        });

        return message;
    }

    async createContent(
        id: string,
        type: "text" | "image" | "file" | "video" | "audio",
        text?: string | undefined,
        url?: string | undefined
    ) {
        const createdContent = await this.prisma.content.create({
            data: {
                id: id,
                text: text ?? null,
                url: url ?? null,
            },
        });

        return {
            id: createdContent.id,
            type,
            text: createdContent.text ?? null,
            url: createdContent.url ?? null,
        };
    }

    async sendMessage({ id, chatId, content, replyToId = undefined }: MessageSendDto) {
        const profile = await this.userService.getProfileById(id);

        const contentsRow: MessageSendDto["content"] = content;

        const createdContent = await Promise.all(
            contentsRow.map((f) =>
                this.createContent(f.id, f.type, f.text ?? undefined, f.url ?? undefined)
            )
        );

        const message = await this.createMessage(id, chatId, createdContent, replyToId);

        const entity = new MessageItemEntity(message, profile, createdContent);

        emitTo("chat", `chat_${chatId}`, "new-message", entity.toJSON());

        return entity.toJSON();
    }

    async deleteContent(tx: Prisma.TransactionClient, messageId: string) {
        const contentLinks = await tx.messages_content.findMany({
            where: { id_messages: messageId },
            select: { id_content: true },
        });

        await tx.messages_content.deleteMany({
            where: { id_messages: messageId },
        });

        const contentIds = contentLinks.map((c) => c.id_content);
        if (contentIds.length) {
            await tx.content.deleteMany({
                where: { id: { in: contentIds } },
            });
        }
    }

    async deleteMessage(chatId: string, messageId: string) {
        await this.prisma.$transaction(async (tx) => {
            await this.deleteContent(tx, messageId);
            await tx.messages.delete({ where: { id: messageId } });
        });

        emitTo("chat", `chat_${chatId}`, "delete-message", { messageId: messageId });
    }

    async editContent(
        tx: Prisma.TransactionClient,
        messageId: string,
        content: MessageContentDto[]
    ) {
        await this.deleteContent(tx, messageId);

        const newContent = await Promise.all(
            content.map((item) =>
                this.createContent(
                    uuidv4(),
                    item.type,
                    item.text ?? undefined,
                    item.url ?? undefined
                )
            )
        );

        const updated = await tx.messages.update({
            where: { id: messageId },
            data: {
                is_edited: true,
                updated_at: new Date(),
                messages_content: {
                    create: newContent.map((c) => ({
                        id_content: c.id,
                        type: c.type,
                        uploaded_at: new Date(),
                    })),
                },
            },
            include: {
                messages_content: {
                    include: { content: true },
                },
            },
        });

        return { updated, newContent };
    }

    async editMessage({ id, chatId, messageId, content }: MessageEditDto & { chatId: string }) {
        const profile = await this.userService.getProfileById(id);

        const { updated, newContent } = await this.prisma.$transaction(async (tx) => {
            return await this.editContent(tx, messageId, content);
        });

        const entity = new MessageItemEntity(
            updated,
            profile,
            updated.messages_content.map((mc) => mc.content)
        );

        const result = entity.toJSON();

        emitTo("chat", `chat_${chatId}`, "edit-message", result);
        return result;
    }
}
