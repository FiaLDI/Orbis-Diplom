import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { AuthMiddleware } from "@/middleware/auth.middleware";
import { RolePermissionMiddleware } from "@/middleware/role.permission.middleware";
import { ModerationController } from "./controllers/moderation.controller";

export const moderationModule = () => {
    const router = express.Router();

    const controller = container.get<ModerationController>(TYPES.ModerationController);
    const auth = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
    const rolePerm = container.get<RolePermissionMiddleware>(TYPES.RolePermissionMiddleware);

    /* =======================
       AUDIT LOGS
    ======================= */
    router.get(
        "/:serverId/moderation/logs",
        auth.handle.bind(auth),
        rolePerm.check("VIEW_AUDIT_LOGS"),
        controller.getAuditLogs.bind(controller)
    );

    /* =======================
       BANS
    ======================= */
    router.get(
        "/:serverId/moderation/bans",
        auth.handle.bind(auth),
        rolePerm.check("VIEW_BANS"),
        controller.getBannedUsers.bind(controller)
    );

    router.post(
        "/:serverId/moderation/bans/:userId",
        auth.handle.bind(auth),
        rolePerm.check("BAN_USERS"),
        controller.banUser.bind(controller)
    );

    router.delete(
        "/:serverId/moderation/bans/:userId",
        auth.handle.bind(auth),
        rolePerm.check("BAN_USERS"),
        controller.unbanUser.bind(controller)
    );

    /* =======================
       KICKS
    ======================= */
    router.delete(
        "/:serverId/moderation/kicks/:userId",
        auth.handle.bind(auth),
        rolePerm.check("KICK_USERS"),
        controller.kickUser.bind(controller)
    );

    return router;
};
