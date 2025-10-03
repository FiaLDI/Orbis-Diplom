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
        if (!token) {
            return res.status(401).json({ message: "Token is missing" });
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
        ) as any;
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Создаем сервер и добавляем запись в user_server в одной транзакции
        const result = await prisma.$transaction(async (tx: any) => {
            const server = await tx.servers.create({
                data: {
                    creator_id: decoded.id,
                    name,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            await tx.user_server.create({
                data: {
                    user_id: decoded.id,
                    server_id: server.id,
                    created_at: new Date(),
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
            return res
                .status(401)
                .json({ message: "Invalid or expired token" });
        }

        console.error("Server creation error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const joinServer = async (req: Request, res: Response) => {
    const serverId = parseInt(req.params.id);

    if (!serverId) {
        return res.status(400).json({ message: "Server ID is required" });
    }

    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token is missing" });
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
        ) as any;
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        await prisma.user_server.create({
            data: {
                user_id: decoded.id,
                server_id: serverId,
                created_at: new Date(),
            },
        });

        res.status(200).json({ message: "Successfully joined the server" });
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

export {
    getServers,
    getServerInfo,
    createServer,
    joinServer,
    createChat,
    getFastInfoUserServer,
};
