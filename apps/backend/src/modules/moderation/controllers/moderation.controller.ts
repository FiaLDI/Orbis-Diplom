import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import { ModerationService } from "../services/moderation.services";
import { AuditModerationSchema } from "../dtos/audit.moderation.dto";
import { Errors } from "@/common/errors";
import { ActionModerationSchema } from "../dtos/action.moderation.dto";

@injectable()
export class ModerationController {
    constructor(
        @inject(TYPES.ModerationService)
        private moderationService: ModerationService
    ) {}

    async getAuditLogs(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = AuditModerationSchema.parse({
                ...(req as any).user,
                serverId: parseInt(req.params.serverId),
            });

            const logs = await this.moderationService.getAuditLogs(dto.serverId);

            res.json({ data: logs });
        } catch (err) {
            next(err);
        }
    }

    async getBannedUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = AuditModerationSchema.parse({
                ...(req as any).user,
                serverId: parseInt(req.params.serverId),
            });
            const bans = await this.moderationService.getBannedUsers(dto.serverId);
            res.json({ data: bans });
        } catch (err) {
            next(err);
        }
    }

    async banUser(req: any, res: Response, next: NextFunction) {
        try {
            const dto = ActionModerationSchema.parse({
                ...(req as any).user,
                serverId: parseInt(req.params.serverId),
                userId: parseInt(req.params.userId),
                reason: req.body.reason,
            });

            if ((req as any).user.id === dto.userId) {
                throw Errors.conflict("You cannot ban yourself");
            }

            const ban = await this.moderationService.banUser(dto);
            res.status(201).json({ message: "User banned successfully", data: ban });
        } catch (err: any) {
            next(err);
        }
    }

    async unbanUser(req: any, res: Response, next: NextFunction) {
        try {
            const dto = ActionModerationSchema.parse({
                ...(req as any).user,
                serverId: parseInt(req.params.serverId),
                userId: parseInt(req.params.userId),
                reason: req.body.reason,
            });

            if ((req as any).user.id === dto.userId) {
                throw Errors.conflict("You cannot unban yourself");
            }

            const result = await this.moderationService.unbanUser(dto);
            res.json({ message: result.message });
        } catch (err: any) {
            next(err);
        }
    }

    async kickUser(req: any, res: Response, next: NextFunction) {
        try {
            const dto = ActionModerationSchema.parse({
                ...(req as any).user,
                serverId: parseInt(req.params.serverId),
                userId: parseInt(req.params.userId),
                reason: req.body.reason,
            });

            if ((req as any).user.id === dto.userId) {
                throw Errors.conflict("You cannot kick yourself");
            }

            const result = await this.moderationService.kickUser(dto);

            res.json({ message: result.message });
        } catch (err: any) {
            next(err);
        }
    }
}
