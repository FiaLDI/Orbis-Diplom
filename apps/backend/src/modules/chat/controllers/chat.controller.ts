import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import { ChatService } from "../services/chat.service";
import { UpdateChatSchema } from "../dtos/update.chat.dto";
import { DeleteChatSchema } from "../dtos/delete.chat.dto";
import { StartChatSchema } from "../dtos/start.chat.dto";

@injectable()
export class ChatController {
    constructor(@inject(TYPES.ChatService) private chatService: ChatService) {}

    updateChat = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = UpdateChatSchema.parse({
                ...(req as any).user,
                chatId: parseInt(req.params.id),
                name: req.body.name,
            });
            const entity = await this.chatService.updateChat(dto.id, dto.chatId, dto.name);

            return res.json({
                message: "Updated chat",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    deleteChat = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = DeleteChatSchema.parse({
                ...(req as any).user,
                chatId: parseInt(req.params.id),
            });
            const entity = await this.chatService.deleteChat(dto.id, dto.chatId);

            return res.json({
                message: "Chat deleted",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    startChat = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = StartChatSchema.parse({
                ...(req as any).user,
                userId: parseInt(req.params.id),
            });
            const entity = await this.chatService.startChat(dto.id, dto.userId);

            return res.json({
                message: "Chat started",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };
}
