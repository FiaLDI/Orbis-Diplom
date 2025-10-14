import jwt from "jsonwebtoken";
import { ioJournal } from "@/server";
import { Request, Response } from "express";
import { prisma } from "@/config";

const getServers = async (req: Request, res: Response) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res
                .status(401)
                .json({ message: "Authorization token missing" });
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
        ) as any;

        const servers = await prisma.servers.findMany({
            where: {
                user_server: {
                    some: {
                        user_id: decoded.id,
                    },
                },
            },
            distinct: ["id"],
            select: {
                id: true,
                name: true,
                avatar_url: true,
            },
        });

        return res.json(servers);
    } catch (err) {
        console.error("Error in getServers:", err);

        if (err instanceof jwt.JsonWebTokenError) {
            return res
                .status(401)
                .json({ message: "Invalid or expired token" });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const getFastInfoUserServer = async (req: Request, res: Response) => {
    const serverId = req.params.id;

    try {
        const userInfo = await prisma.users.findMany({
            where: {
                user_server: {
                    some: {
                        server_id: Number(serverId),
                    },
                },
            },
            select: {
                id: true,
                username: true,
                user_profile: {
                    select: {
                        avatar_url: true,
                        about: true,
                    },
                },
            },
        });

        res.json(userInfo);
    } catch (err) {
        res.status(401).json({ message: "need refresh" });
    }
};

const getServerInfo = async (req: Request, res: Response) => {
    const serverId = parseInt(req.params.id);

    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.sendStatus(401);

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
        ) as any;

        // Получаем сервер с чатами и голосовыми каналами
        const server = await prisma.servers.findUnique({
            where: { id: serverId },
            include: {
                server_chats: {
                    include: {
                        chat: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }

        const chats = server.server_chats.map((sc: any) => sc.chat);

        const serverInfo = {
            id: server.id,
            name: server.name,
            avatar_url: server.avatar_url,
            created_at: server.created_at,
            updated_at: server.updated_at,
            chats,
        };

        res.json(serverInfo);
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "need refresh" });
    }
};

const createServer = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token is missing" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    const result = await prisma.$transaction(async (tx) => {
      // сервер
      const server = await tx.servers.create({
        data: {
          creator_id: decoded.id,
          name,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // роль creator
      const creatorRole = await tx.role_server.create({
        data: { name: "creator", server_id: server.id },
      });

      // роль default
      const defaultRole = await tx.role_server.create({
        data: { name: "default", server_id: server.id },
      });

      // все права
      const allPerms = await tx.permission_type.findMany();

      // creator получает все
      await tx.role_permission.createMany({
        data: allPerms.map((p) => ({
          role_id: creatorRole.id,
          permission_id: p.id,
        })),
      });

      // default получает только ограниченный список
      const defaultPerms = ["MANAGE_MESSAGES", "SEND_MESSAGES", "ATTACH_FILES", "VIEW_CHANNEL"];
      const allowed = allPerms.filter((p) => defaultPerms.includes(p.name));

      await tx.role_permission.createMany({
        data: allowed.map((p) => ({
          role_id: defaultRole.id,
          permission_id: p.id,
        })),
      });

      // участник (создатель сервера)
      await tx.user_server.create({
        data: {
          user_id: decoded.id,
          server_id: server.id,
          created_at: new Date(),
        },
      });

      // creator назначается создателю
      await tx.user_server_roles.create({
        data: {
          user_id: decoded.id,
          server_id: server.id,
          role_id: creatorRole.id,
        },
      });

      return server;
    });

    res.status(200).json({
      message: "Server created successfully",
      serverId: result.id,
    });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error("Server creation error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


const joinServer = async (req: Request, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  if (!serverId) return res.status(400).json({ message: "Server ID is required" });

  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token is missing" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    const userId = decoded.id;

    // Проверяем, состоит ли уже юзер в сервере
    const existing = await prisma.user_server.findUnique({
      where: {
        user_id_server_id: {
          user_id: userId,
          server_id: serverId,
        },
      },
    });

    if (existing) {
      return res.status(409).json({ message: "User already joined this server" });
    }

    await prisma.$transaction(async (tx) => {
      // создаём запись user_server
      await tx.user_server.create({
        data: {
          user_id: userId,
          server_id: serverId,
          created_at: new Date(),
        },
      });

      // ищем роль default для этого сервера
      const defaultRole = await tx.role_server.findFirst({
        where: { server_id: serverId, name: "default" },
      });

      if (defaultRole) {
        // назначаем default роль
        await tx.user_server_roles.create({
          data: {
            user_id: userId,
            server_id: serverId,
            role_id: defaultRole.id,
          },
        });
      }
    });

    res.status(200).json({ message: "Successfully joined the server" });
  } catch (err) {
    console.error("Join server error:", err);
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const createChat = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.sendStatus(401);

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
        ) as any;
        if (!decoded) return res.sendStatus(401);

        // Проверяем, что сервер существует
        const server = await prisma.servers.findUnique({
            where: { id: Number(id) },
        });

        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }

        const chat = await prisma.chats.create({
            data: {
                name: "default chat",
                creator_id: decoded.id,
                created_at: new Date(),
                server_chats: {
                    create: {
                        id_server: Number(id),
                    },
                },
            },
        });

        ioJournal.to(`server:${id}`).emit("chat-created", { chatId: chat.id });

        res.status(200).json({ message: "Successfully created the chat" });
    } catch (err) {
        console.error(err);
        if (err instanceof jwt.JsonWebTokenError) {
            return res
                .status(401)
                .json({ message: "Invalid or expired token" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

// PATCH /servers/:id
const updateServer = async (req: Request, res: Response) => {
    const serverId = parseInt(req.params.id);
    const { name, avatar_url } = req.body;

    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.sendStatus(401);
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;

        const server = await prisma.servers.findUnique({ where: { id: serverId } });
        if (!server) return res.status(404).json({ message: "Server not found" });

        if (server.creator_id !== decoded.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const updated = await prisma.servers.update({
            where: { id: serverId },
            data: { name, avatar_url, updated_at: new Date() },
        });

        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE /servers/:id
const deleteServer = async (req: Request, res: Response) => {
  const serverId = parseInt(req.params.id);

  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.sendStatus(401);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;

    const server = await prisma.servers.findUnique({ where: { id: serverId } });
    if (!server) return res.status(404).json({ message: "Server not found" });

    if (server.creator_id !== decoded.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.$transaction(async (tx) => {
      // удаляем все user_server_roles
      await tx.user_server_roles.deleteMany({ where: { server_id: serverId } });

      // удаляем все user_server
      await tx.user_server.deleteMany({ where: { server_id: serverId } });

      // удаляем все роли
      await tx.role_permission.deleteMany({
        where: { role: { server_id: serverId } },
      });
      await tx.role_server.deleteMany({ where: { server_id: serverId } });

      // удаляем все server_chats и сами чаты
      await tx.server_chats.deleteMany({ where: { id_server: serverId } });
      await tx.chats.deleteMany({
        where: { server_chats: { some: { id_server: serverId } } },
      });

      // удаляем баны, инвайты, логи, репорты
      await tx.server_bans.deleteMany({ where: { server_id: serverId } });
      await tx.invites.deleteMany({ where: { server_id: serverId } });
      await tx.audit_logs.deleteMany({ where: { server_id: serverId } });
      await tx.reports.deleteMany({ where: { server_id: serverId } });

      // сам сервер
      await tx.servers.delete({ where: { id: serverId } });
    });

    res.json({ message: "Server and all related data deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// DELETE /servers/:id/members/:userId
const kickMember = async (req: Request, res: Response) => {
    const serverId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);

    try {
        await prisma.user_server.delete({
            where: {
                user_id_server_id: { user_id: userId, server_id: serverId },
            },
        });
        res.json({ message: "Member kicked" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// POST /servers/:id/members/:userId/ban
const banMember = async (req: Request, res: Response) => {
    const serverId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);

    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.sendStatus(401);
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;

        await prisma.server_bans.create({
            data: {
                server_id: serverId,
                user_id: userId,
                banned_by: decoded.id,
                created_at: new Date(),
            },
        });

        res.json({ message: "User banned" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE /servers/:id/members/:userId/ban
const unbanMember = async (req: Request, res: Response) => {
    const serverId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);

    try {
        await prisma.server_bans.delete({
            where: { server_id_user_id: { server_id: serverId, user_id: userId } },
        });
        res.json({ message: "User unbanned" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET /servers/:id/chats
const getServerChats = async (req: Request, res: Response) => {
    const serverId = parseInt(req.params.id);

    try {
        const chats = await prisma.chats.findMany({
            where: {
                server_chats: { some: { id_server: serverId } },
            },
            select: { id: true, name: true, created_at: true },
        });

        res.json(chats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET /servers/:id/members
const getServerMembers = async (req: Request, res: Response) => {
  const serverId = parseInt(req.params.id, 10);

  try {
    const members = await prisma.users.findMany({
      where: {
        user_server: { some: { server_id: serverId } },
      },
      select: {
        id: true,
        username: true,
        user_profile: {
          select: {
            avatar_url: true,
            about: true,
          },
        },
        user_server: {
          where: { server_id: serverId },
          select: {
            roles: {
              select: {
                role: {
                  select: {
                    id: true,
                    name: true,
                    color: true,
                    role_permission: {
                      select: {
                        permission: { select: { id: true, name: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Преобразуем чтобы сразу получить permissions в удобном виде
    const mapped = members.map((m) => ({
      ...m,
      user_server: m.user_server.map((us) => ({
        ...us,
        roles: us.roles.map((r) => ({
          id: r.role.id,
          name: r.role.name,
          color: r.role.color,
          permissions: r.role.role_permission.map((rp) => rp.permission),
        })),
      })),
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Error in getServerMembers:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



// GET /servers/:id/chats/:chatId
const getChatInfo = async (req: Request, res: Response) => {
    const chatId = parseInt(req.params.chatId);

    try {
        const chat = await prisma.chats.findUnique({
            where: { id: chatId },
            include: {
                chat_users: {
                    include: { users: { select: { id: true, username: true } } },
                },
            },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.json(chat);
    } catch (err) {
        console.error("Error in getChatInfo:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE /servers/:id/chats/:chatId
const deleteChat = async (req: Request, res: Response) => {
    const chatId = parseInt(req.params.chatId);

    try {
        const chat = await prisma.chats.findUnique({ where: { id: chatId } });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        await prisma.chats.delete({ where: { id: chatId } });

        res.json({ message: "Chat deleted" });
    } catch (err) {
        console.error("Error in deleteChat:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


export {
    getServers,
    getServerInfo,
    getFastInfoUserServer,
    createServer,
    joinServer,
    createChat,
    updateServer,
    deleteServer,
    kickMember,
    banMember,
    unbanMember,
    getServerChats,
    getServerMembers,
    getChatInfo,
    deleteChat,
};

