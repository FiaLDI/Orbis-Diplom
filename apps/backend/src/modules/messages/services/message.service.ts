import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { content, PrismaClient } from "@prisma/client";
import { MessageHistoryDto } from "../dtos/message.history.dto";
import { UserService } from "@/modules/users";
import { MessageListEntity } from "../entity/message.list.entity";
import { UserProfile } from "@/modules/users/entity/user.profile";
import { MessageSendDto } from "../dtos/message.send.dto";
import { v4 as uuidv4 } from "uuid";
import { MessageItemEntity } from "../entity/message.item.entity";
import { emitTo } from "@/socket/registry";

@injectable()
export class MessageService {
    constructor(
        @inject(TYPES.Prisma) private prisma: PrismaClient,
        @inject(TYPES.UserService) private userService: UserService
    ) {}

    async getMessages({ chatId, offset = 0 }: MessageHistoryDto) {
        const messages = await this.prisma.messages.findMany({
            where: { chat_id: chatId },
            orderBy: { created_at: "desc" },
            take: 20,
            skip: offset * 20,
            include: {
                messages_content: {
                    include: {
                        content: { select: { id: true, text: true, url: true } },
                    },
                },
            },
        });

        const messageList = new MessageListEntity(messages);
        const userIds = messageList.getUserIds();

        const profiles = await Promise.all(
            userIds.map((id) => this.userService.getProfileById(id))
        );

        const profilesMap = UserProfile.getUsersMap(profiles);

        return messageList.toJSON(profilesMap);
    }

    async createMessage(
        id: number,
        chatId: number,
        contentsRow: MessageSendDto["content"],
        replyToId?: number | undefined
    ) {
        const message = await this.prisma.messages.create({
            data: {
                chat_id: Number(chatId),
                user_id: id,
                reply_to_id: replyToId ? Number(replyToId) : null,
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
}
