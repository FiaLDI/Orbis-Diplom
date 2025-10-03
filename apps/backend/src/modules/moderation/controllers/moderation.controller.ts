import { Request, Response } from "express";
import { prisma } from "@/config";

// --- Получить список репортов ---
export const getReports = async (req: any, res: Response) => {
  try {
    const reports = await prisma.reports.findMany({
      include: {
        reporter: { select: { id: true, username: true } },
        resolver: { select: { id: true, username: true } },
        message: { select: { id: true, content_text: true } },
        server: { select: { id: true, name: true } },
      },
      orderBy: { created_at: "desc" },
      take: 50,
    });

    res.json(reports);
  } catch (err) {
    console.error("getReports error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Изменить статус репорта (resolved/rejected) ---
export const updateReportStatus = async (req: any, res: Response) => {
  const reportId = parseInt(req.params.id, 10);
  const { status } = req.body; // "resolved" | "rejected"

  if (!["resolved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const report = await tx.reports.update({
        where: { id: reportId },
        data: {
          status,
          resolved_by: req.user.id,
        },
        include: { server: true },
      });

      // создаём запись в аудит-логах
      await tx.audit_logs.create({
        data: {
          server_id: report.server_id,
          actor_id: req.user.id,
          action: status === "resolved" ? "REPORT_RESOLVED" : "REPORT_REJECTED",
          target_id: String(report.id),
          metadata: JSON.stringify({ reason: report.reason }),
        },
      });

      return report;
    });

    res.json(updated);
  } catch (err) {
    console.error("updateReportStatus error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Отправить жалобу ---
export const createReport = async (req: any, res: Response) => {
  const { server_id, message_id, reason } = req.body;

  if (!server_id || !reason) {
    return res.status(400).json({ message: "server_id and reason are required" });
  }

  try {
    const report = await prisma.$transaction(async (tx) => {
      const newReport = await tx.reports.create({
        data: {
          server_id,
          message_id: message_id || null,
          reporter_id: req.user.id,
          reason,
        },
      });

      // логируем создание репорта
      await tx.audit_logs.create({
        data: {
          server_id,
          actor_id: req.user.id,
          action: "REPORT_CREATED",
          target_id: String(newReport.id),
          metadata: JSON.stringify({ reason }),
        },
      });

      return newReport;
    });

    res.status(201).json(report);
  } catch (err) {
    console.error("createReport error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Получить список действий (audit log) ---
export const getAuditLogs = async (req: any, res: Response) => {
  try {
    const logs = await prisma.audit_logs.findMany({
      include: {
        actor: { select: { id: true, username: true } },
        server: { select: { id: true, name: true } },
      },
      orderBy: { created_at: "desc" },
      take: 100,
    });

    res.json(logs);
  } catch (err) {
    console.error("getAuditLogs error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const banUser = async (req: any, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  const userId = parseInt(req.params.userId, 10);
  const { reason } = req.body;

  try {
    const ban = await prisma.$transaction(async (tx) => {
      // создаём бан
      const banEntry = await tx.server_bans.create({
        data: {
          server_id: serverId,
          user_id: userId,
          reason: reason || "No reason provided",
          banned_by: req.user.id,
        },
      });

      // логируем
      await tx.audit_logs.create({
        data: {
          server_id: serverId,
          actor_id: req.user.id,
          action: "BAN_ADD",
          target_id: String(userId),
          metadata: JSON.stringify({ reason }),
        },
      });

      return banEntry;
    });

    res.status(201).json({ message: "User banned", ban });
  } catch (err) {
    console.error("banUser error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Разбан пользователя ---
export const unbanUser = async (req: any, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  const userId = parseInt(req.params.userId, 10);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.server_bans.delete({
        where: { server_id_user_id: { server_id: serverId, user_id: userId } },
      });

      await tx.audit_logs.create({
        data: {
          server_id: serverId,
          actor_id: req.user.id,
          action: "BAN_REMOVE",
          target_id: String(userId),
        },
      });
    });

    res.json({ message: "User unbanned" });
  } catch (err) {
    console.error("unbanUser error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Кик пользователя с сервера ---
export const kickUser = async (req: any, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  const userId = parseInt(req.params.userId, 10);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user_server.delete({
        where: { user_id_server_id: { user_id: userId, server_id: serverId } },
      });

      await tx.audit_logs.create({
        data: {
          server_id: serverId,
          actor_id: req.user.id,
          action: "KICK",
          target_id: String(userId),
        },
      });
    });

    res.json({ message: "User kicked from server" });
  } catch (err) {
    console.error("kickUser error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};