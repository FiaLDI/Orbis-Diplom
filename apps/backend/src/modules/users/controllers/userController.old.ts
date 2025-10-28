import { Request, Response } from "express";
import { prisma } from "@/config";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    const users = await prisma.users.findMany({
      where: name
        ? { username: { contains: String(name), mode: "insensitive" } }
        : {},
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.users.findUnique({
      where: { id },
      include: {
        user_profile: true,
        user_preferences: true,
      },
    });

    if (!user) return res.sendStatus(404);

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      number: user.number,
      avatar_url: user.user_profile?.avatar_url || null,
      about: user.user_profile?.about || null,
      first_name: user.user_profile?.first_name || null,
      last_name: user.user_profile?.last_name || null,
      birth_date: user.user_profile?.birth_date || null,
      gender: user.user_profile?.gender || null,
      location: user.user_profile?.location || null,
    });
  } catch (err) {
    console.error("❌ getUserById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, username, password_hash, number } = req.body;
    const newUser = await prisma.users.create({
      data: { email, username, password_hash, number },
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// controllers/userController.ts
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const {
      email,
      username,
      number,
      first_name,
      last_name,
      birth_date,
      avatar_url,
      gender,
      location,
      about,
    } = req.body;

    const updated = await prisma.users.update({
      where: { id },
      data: {
        email,
        username,
        number,
        user_profile: {
          upsert: {
            update: {
              first_name,
              last_name,
              birth_date: birth_date ? new Date(birth_date) : undefined,
              avatar_url,
              gender,
              location,
              about,
            },
            create: {
              first_name,
              last_name,
              birth_date: birth_date ? new Date(birth_date) : undefined,
              avatar_url,
              gender,
              location,
              about,
            },
          },
        },
      },
      include: { user_profile: true },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.users.delete({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserChats = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const chats = await prisma.chats.findMany({
      where: {
        chat_users: {
          some: { user_id: userId },
        },
      },
      include: {
        chat_users: { include: { users: true } }, // подтянем участников
        messages: { take: 10, orderBy: { created_at: "desc" } }, // последние сообщения
      },
    });

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};