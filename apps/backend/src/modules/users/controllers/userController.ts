import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "@/config";
import bcrypt from "bcrypt";

const getUserInfo = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);

    try {
        const user = await prisma.users.findUnique({
            where: { id: userId },
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

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Объединяем данные пользователя и профиля
        const userInfo = {
            id: user.id,
            username: user.username,
            avatar_url: user.user_profile?.avatar_url ?? null,
            about: user.user_profile?.about ?? null,
        };

        res.json(userInfo);
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "need refresh" });
    }
};

const getChats = async (req: Request, res: Response) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.sendStatus(401);

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
        ) as any;
        if (!decoded) return res.sendStatus(401);

        const chats = await prisma.chat_users.findMany({
            where: {
                user_id: decoded.id,
            },
            select: {
                chat_id: true,
                chats: {
                    select: {
                        name: true,
                    },
                },
                users: {
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
                },
            },
        });

        // Преобразуем результат для удобства клиента
        const result = chats.map((item) => ({
            id: item.users.id,
            username: item.chats.name, // В исходном SQL было c.name AS username — возможно, ошибка, тут исправлено
            avatar_url: item.users.user_profile?.avatar_url ?? null,
            about: item.users.user_profile?.about ?? null,
            chat_id: item.chat_id,
        }));

        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "need refresh" });
    }
};

const createChat = async (req: Request, res: Response) => {
    const { id } = req.body; // id пользователя для добавления в чат

    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.sendStatus(401);

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
        ) as any;
        if (!decoded) return res.sendStatus(401);

        // Создаем чат и одновременно добавляем создателя в чат
        const chat = await prisma.$transaction(async (prisma) => {
            const createdChat = await prisma.chats.create({
                data: {
                    name: "default chat",
                    creator_id: decoded.id,
                    created_at: new Date(),
                },
            });

            // Добавляем пользователя в чат
            await prisma.chat_users.create({
                data: {
                    user_id: id,
                    chat_id: createdChat.id,
                },
            });

            return createdChat;
        });

        res.json({ message: "Create chat successful", chatId: chat.id });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "need refresh" });
    }
};

const startchat = async (req: Request, res: Response) => {
    const id_user = parseInt(req.params.id, 10);
    if (isNaN(id_user)) {
        return res.status(400).json({ error: "Invalid user id" });
    }

    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.sendStatus(401);
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
        ) as any;
        if (!decoded) return res.sendStatus(401);

        // Проверяем, есть ли уже чат между двумя пользователями
        const existingChat = await prisma.$queryRaw<
            { chat_id: number; u1: string; u2: string }[]
        >`
      SELECT cu1.chat_id, u1.username as u1, u2.username as u2
      FROM chat_users cu1
      JOIN chat_users cu2 ON cu1.chat_id = cu2.chat_id
      JOIN users u1 ON u1.id = cu1.user_id
      JOIN users u2 ON u2.id = cu2.user_id
      WHERE cu1.user_id = ${Number(decoded.id)} AND cu2.user_id = ${id_user}
    `;

        // Получаем имена пользователей
        const u1 = await prisma.users.findUnique({
            where: { id: Number(decoded.id) },
            select: { username: true },
        });
        const u2 = await prisma.users.findUnique({
            where: { id: Number(id_user) },
            select: { username: true },
        });

        if (!u1 || !u2) {
            return res.status(404).json({ message: "User not found" });
        }

        if (existingChat.length > 0) {
            return res.status(400).json({
                message: "Chat already exists",
                chatId: existingChat[0].chat_id,
            });
        }

        // Создаем чат и добавляем пользователей в транзакции
        const chat = await prisma.$transaction(async (tx) => {
            const createdChat = await tx.chats.create({
                data: {
                    name: `${u1.username}, ${u2.username}`,
                    creator_id: decoded.id,
                    created_at: new Date(),
                },
            });

            await tx.chat_users.createMany({
                data: [
                    { user_id: decoded.id, chat_id: createdChat.id },
                    { user_id: Number(id_user), chat_id: createdChat.id },
                ],
            });

            return createdChat;
        });

        res.json({ message: "Success", chatId: chat.id });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "need refresh" });
    }
};

const getUserbyName = async (req: Request, res: Response) => {
    const userName = req.query.name as string;

    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.sendStatus(401);
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
        ) as any;
        if (!decoded) return res.sendStatus(401);

        const users = await prisma.users.findMany({
            where: {
                username: {
                    startsWith: userName,
                    mode: "insensitive", // если нужен регистронезависимый поиск
                },
            },
            select: {
                id: true,
                username: true,
                user_profile: {
                    select: {
                        avatar_url: true,
                    },
                },
            },
            take: 10,
        });

        // Преобразуем структуру, если нужно (Prisma вложенность)
        const result = users.map((u) => ({
            id: u.id,
            username: u.username,
            avatar_url: u.user_profile?.avatar_url || null,
        }));

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "need refresh" });
    }
};

const editUser = async (req: Request, res: Response) => {
    const { username, email, password, number } = req.body;
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.sendStatus(401);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
    if (!decoded) return res.sendStatus(401);

    try {
        if (username) {
            await prisma.users.update({
                where: {
                    id: decoded.id,
                },
                data: {
                    username: username,
                },
            });
        }

        if (email) {
            await prisma.users.update({
                where: {
                    id: decoded.id,
                },
                data: {
                    email: email,
                },
            });
        }

        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await prisma.users.update({
                where: {
                    id: decoded.id,
                },
                data: {
                    password_hash: hashedPassword,
                },
            });
        }

        if (number) {
            await prisma.users.update({
                where: {
                    id: decoded.id,
                },
                data: {
                    number: number,
                },
            });
        }
    } catch (error) {
        console.log(error);
    }
};

export {
    getUserInfo,
    getChats,
    createChat,
    startchat,
    getUserbyName,
};
