import { Request, Response } from "express";
import { prisma } from "@/config";
import jwt from "jsonwebtoken";

export const getChats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const where = userId
      ? {
          chat_users: {
            some: { user_id: Number(userId) },
          },
        }
      : {};

    const chats = await prisma.chats.findMany({
      where,
      include: {
        chat_users: { include: { users: true } },
        messages: { take: 10, orderBy: { created_at: "desc" } },
      },
    });

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getChatById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const chat = await prisma.chats.findUnique({
      where: { id },
      include: { chat_users: true, messages: true },
    });
    if (!chat) return res.sendStatus(404);
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createChat = async (req: Request, res: Response) => {
  try {
    const { creator_id, name } = req.body;
    const chat = await prisma.chats.create({
      data: {
        creator_id,
        created_at: new Date(),
        name,
      },
    });
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateChat = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const chat = await prisma.chats.update({
      where: { id },
      data: { name },
    });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.chats.delete({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const startChat = async (req: Request, res: Response) => {
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