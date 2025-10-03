import { Router } from "express";
import {
  getReports,
  updateReportStatus,
  createReport,
  getAuditLogs,
  banUser,
  unbanUser,
  kickUser,
} from "../controllers/moderation.controller";
import { authenticate } from "@/modules/auth";

export const moderationRouter = Router();

// Репорты
moderationRouter.get("/reports", authenticate, getReports);
moderationRouter.post("/reports", authenticate, createReport);
moderationRouter.patch("/reports/:id", authenticate, updateReportStatus);

// Аудит-логи
moderationRouter.get("/logs", authenticate, getAuditLogs);

// Модераторские действия
moderationRouter.post("/servers/:id/ban/:userId", authenticate, banUser);
moderationRouter.delete("/servers/:id/ban/:userId", authenticate, unbanUser);
moderationRouter.delete("/servers/:id/kick/:userId", authenticate, kickUser);
