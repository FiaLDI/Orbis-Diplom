import { Router } from "express";
import {
    getAuditLogs,
    banUser,
    unbanUser,
    kickUser,
    getBannedUsers,
} from "../controllers/moderation.controller";
import { authenticate } from "@/modules/auth";

export const moderationRouter = Router();

moderationRouter.get("/logs", authenticate, getAuditLogs);
moderationRouter.get("/:id/logs", getAuditLogs);

moderationRouter.post("/servers/:id/ban/:userId", authenticate, banUser);
moderationRouter.delete("/servers/:id/ban/:userId", authenticate, unbanUser);
moderationRouter.delete("/servers/:id/kick/:userId", authenticate, kickUser);
moderationRouter.get("/servers/:id/banned", authenticate, getBannedUsers);
