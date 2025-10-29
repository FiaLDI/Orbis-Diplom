import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import { MessageService } from "../services/message.service";
import { MessageHistorySchema } from "../dtos/message.history.dto";
import { MessageSendSchema } from "../dtos/message.send.dto";

@injectable()
export class MessageController {
    constructor(@inject(TYPES.MessageService) private messageService: MessageService) {}

    getPersonalMessages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = MessageHistorySchema.parse({
                ...(req as any).user,
                chatId: parseInt(req.params.id),
                offset: Number(req.query.offset) || Number(0),
            });
            const entity = await this.messageService.getMessages({
                id: dto.id,
                chatId: dto.chatId,
                offset: dto.offset,
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
                chatId: parseInt(req.params.id),
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
                chatId: parseInt(req.params.id),
                offset: req.query.offset,
            });
            const entity = await this.messageService.getMessages({
                id: dto.id,
                chatId: dto.chatId,
                offset: dto.offset,
            });

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
            const dto = MessageHistorySchema.parse({
                ...(req as any).user,
                chatId: parseInt(req.params.id),
                offset: req.query.offset,
            });
            const entity = await this.messageService.getMessages({
                id: dto.id,
                chatId: dto.chatId,
                offset: dto.offset,
            });

            return res.json({
                message: "Profile",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = MessageHistorySchema.parse({
                ...(req as any).user,
                chatId: parseInt(req.params.id),
                offset: req.query.offset,
            });
            const entity = await this.messageService.getMessages({
                id: dto.id,
                chatId: dto.chatId,
                offset: dto.offset,
            });

            return res.json({
                message: "Profile",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };
}
