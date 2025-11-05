import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import { ModerationService } from "../services/moderation.services";

@injectable()
export class ModerationController {
    constructor(
        @inject(TYPES.ModerationService)
        private moderationService: ModerationService
    ) {}

    /* =======================
       AUDIT LOGS
    ======================= */
    async getAuditLogs(req: Request, res: Response) {
        try {
            const serverId = parseInt(req.params.serverId, 10);
            const logs = await this.moderationService.getAuditLogs(serverId);
            res.json({ data: logs });
        } catch (err) {
            console.error("getAuditLogs error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    /* =======================
       BANS
    ======================= */
    async getBannedUsers(req: Request, res: Response) {
        try {
            const serverId = parseInt(req.params.serverId, 10);
            const bans = await this.moderationService.getBannedUsers(serverId);
            res.json({ data: bans });
        } catch (err) {
            console.error("getBannedUsers error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async banUser(req: any, res: Response) {
        const serverId = parseInt(req.params.serverId, 10);
        const userId = parseInt(req.params.userId, 10);
        const { reason } = req.body;

        if (req.user.id === userId) {
            return res.status(403).json({ message: "You cannot ban yourself" });
        }

        try {
            const ban = await this.moderationService.banUser(serverId, userId, req.user.id, reason);
            res.status(201).json({ message: "User banned successfully", data: ban });
        } catch (err: any) {
            console.error("banUser error:", err);
            res.status(500).json({ message: err.message || "Internal server error" });
        }
    }

    async unbanUser(req: any, res: Response) {
        const serverId = parseInt(req.params.serverId, 10);
        const userId = parseInt(req.params.userId, 10);

        if (req.user.id === userId) {
            return res.status(403).json({ message: "You cannot unban yourself" });
        }

        try {
            const result = await this.moderationService.unbanUser(serverId, userId, req.user.id);
            res.json({ message: result.message });
        } catch (err: any) {
            console.error("unbanUser error:", err);
            res.status(500).json({ message: err.message || "Internal server error" });
        }
    }

    /* =======================
       KICKS
    ======================= */
    async kickUser(req: any, res: Response) {
        const serverId = parseInt(req.params.serverId, 10);
        const userId = parseInt(req.params.userId, 10);

        if (req.user.id === userId) {
            return res.status(403).json({ message: "You cannot kick yourself" });
        }

        try {
            const result = await this.moderationService.kickUser(serverId, userId, req.user.id);
            res.json({ message: result.message });
        } catch (err: any) {
            console.error("kickUser error:", err);
            res.status(500).json({
                message: err.message || "Internal server error",
                detail: err?.meta?.constraint || undefined,
            });
        }
    }
}
