import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import { MessageService } from "../services/message.service";
import { MessageHistorySchema } from "../dtos/message.history.dto";
import { MessageSendSchema } from "../dtos/message.send.dto";
import { Errors } from "@/common/errors";
import { MessageDeleteSchema } from "../dtos/message.delete.dto";
import { MessageEditSchema } from "../dtos/message.edit.dto";

@injectable()
export class MessageController {
    constructor(@inject(TYPES.MessageService) private messageService: MessageService) {}

    getPersonalMessages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = MessageHistorySchema.parse({
            ...(req as any).user,
            chatId: req.params.id,
            cursor: req.query.cursor ? String(req.query.cursor) : undefined,
            });

            const entity = await this.messageService.getMessages({
            chatId: dto.chatId,
            cursor: dto.cursor,
            });

            return res.json({
            message: "Messages",
            data: entity,
            });
        } catch (err) {
            next(err);
        }
        };


    sendMessages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = MessageSendSchema.parse({
                ...(req as any).user,
                ...req.body,
                chatId: req.params.id,
            });
            const entity = await this.messageService.sendMessage({
                id: dto.id,
                chatId: dto.chatId,
                content: dto.content,
                replyToId: dto.replyToId,
            });

            return res.json({
                message: "Send",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    getMessageById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = MessageHistorySchema.parse({
                ...(req as any).user,
                chatId: req.params.id,
                offset: req.query.offset,
            });
            const entity = await this.messageService.getMessageById(dto.id);

            return res.json({
                message: "Profile",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    editMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = MessageEditSchema.parse({
                ...(req as any).user,
                ...req.body,
                messageId: req.params.id,
            });

            const { check, checkData } = await this.messageService.checkMessage(dto.messageId);

            if (!check) throw Errors.notFound("Message not found");
            if (!checkData.chatId) throw Errors.notFound("Message not found");
            if (!checkData.userId) throw Errors.notFound("User not found");

            const entity = await this.messageService.editMessage({
                id: dto.id,
                chatId: checkData.chatId,
                messageId: dto.messageId,
                content: dto.content,
            });

            return res.json({
                message: "Edited message",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = MessageDeleteSchema.parse({
                ...(req as any).user,
                messageId: req.params.id,
            });

            const { check, checkData } = await this.messageService.checkMessage(dto.messageId);

            if (!check) throw Errors.notFound("Message not found");
            if (!checkData.chatId) throw Errors.notFound("Message not found");
            if (!checkData.userId) throw Errors.notFound("User not found");

            const entity = await this.messageService.deleteMessage(checkData.chatId, dto.messageId);

            return res.json({
                message: "Deleted message",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };
}
