import { Request, Response } from "express";
import { prisma } from "@/config";
import { sendNotification } from "@/utils/sendNotification"; // ← путь подгони под свой проект
import { emitServerBan, emitServerKick } from "@/utils/sendBan";

// --- Получить список действий (audit log) ---
export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const serverId = req.params.id ? parseInt(req.params.id, 10) : null;

    const whereClause = serverId
      ? { server_id: serverId }
      : {}; // если сервер не указан — все логи

    const logs = await prisma.audit_logs.findMany({
      where: whereClause,
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

// --- Бан пользователя (Ban = Kick + запись о бане + уведомление) ---
export const banUser = async (req: any, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  const userId = parseInt(req.params.userId, 10);
  const { reason } = req.body;

  if (req.user.id === userId) {
    return res.status(403).json({ message: "You cannot ban yourself" });
  }

  try {
    const existingBan = await prisma.server_bans.findUnique({
      where: {
        server_id_user_id: { server_id: serverId, user_id: userId },
      },
    });

    if (existingBan) {
      return res.status(409).json({ message: "User is already banned" });
    }
    
    const ban = await prisma.$transaction(async (tx) => {
      // удалить все роли
      await tx.user_server_roles.deleteMany({
        where: { user_id: userId, server_id: serverId },
      });

      // удалить связь с сервером
      await tx.user_server.deleteMany({
        where: { user_id: userId, server_id: serverId },
      });

      // добавить в баны
      const banEntry = await tx.server_bans.create({
        data: {
          server_id: serverId,
          user_id: userId,
          reason: reason || "No reason provided",
          banned_by: req.user.id,
        },
      });

      // лог
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

    // 🔔 Отправляем уведомление пользователю
    await sendNotification(userId, {
      type: "server_kick",
      title: `Вы были забанены на сервере`,
      body: `Администратор удалил вас с сервера. ${
        reason ? `Причина: ${reason}` : ""
      }`,
      data: { serverId },
    });

    emitServerBan(userId, serverId, reason);

    res.status(201).json({ message: "User banned and removed", ban });
  } catch (err) {
    console.error("banUser error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Разбан пользователя (и возврат на сервер с дефолтной ролью + уведомление) ---
export const unbanUser = async (req: any, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  const userId = parseInt(req.params.userId, 10);

  if (req.user.id === userId) {
    return res.status(403).json({ message: "You cannot ban yourself" });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // удалить запись о бане
      await tx.server_bans.delete({
        where: { server_id_user_id: { server_id: serverId, user_id: userId } },
      });

      // найти дефолтную роль
      const defaultRole = await tx.role_server.findFirst({
        where: { server_id: serverId, name: "default" },
      });

      // вернуть пользователя
      await tx.user_server.create({
        data: {
          user_id: userId,
          server_id: serverId,
          roles: defaultRole
            ? { create: [{ role_id: defaultRole.id }] }
            : undefined,
        },
      });

      // лог
      await tx.audit_logs.create({
        data: {
          server_id: serverId,
          actor_id: req.user.id,
          action: "BAN_REMOVE",
          target_id: String(userId),
        },
      });
    });

    // 🔔 уведомление о разбане
    await sendNotification(userId, {
      type: "system",
      title: "Вы были разбанены",
      body: "Вы снова можете присоединиться к серверу.",
      data: { serverId },
    });

    emitServerKick(userId, serverId);

    res.json({ message: "User unbanned and rejoined" });
  } catch (err) {
    console.error("unbanUser error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Кик пользователя (без бана, с уведомлением) ---
export const kickUser = async (req: any, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  const userId = parseInt(req.params.userId, 10);

  if (req.user.id === userId) {
    return res.status(403).json({ message: "You cannot ban yourself" });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // удалить роли
      await tx.user_server_roles.deleteMany({
        where: { user_id: userId, server_id: serverId },
      });

      // удалить из user_server
      await tx.user_server.delete({
        where: { user_id_server_id: { user_id: userId, server_id: serverId } },
      });

      // лог
      await tx.audit_logs.create({
        data: {
          server_id: serverId,
          actor_id: req.user.id,
          action: "KICK",
          target_id: String(userId),
        },
      });
    });

    // 🔔 уведомление
    await sendNotification(userId, {
      type: "server_kick",
      title: "Вы были исключены с сервера",
      body: "Администратор удалил вас с сервера.",
      data: { serverId },
    });

    
    res.json({ message: "User kicked from server" });
  } catch (err: any) {
    console.error("kickUser error:", err);
    res.status(500).json({
      message: "Internal server error",
      detail: err?.meta?.constraint || err?.message,
    });
  }
};

export const getBannedUsers = async (req: any, res: Response) => {
  const serverId = parseInt(req.params.id, 10);

  try {
    const bans = await prisma.server_bans.findMany({
      where: { server_id: serverId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            user_profile: {
              select: {
                avatar_url: true,
                is_online: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(bans);
  } catch (err) {
    console.error("getBannedUsers error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
