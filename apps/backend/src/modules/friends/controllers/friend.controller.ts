import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "@/config";
import bcrypt from "bcrypt";

const getUsersFriends = async (req: Request, res: Response) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.sendStatus(401);

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
        ) as any;
        if (!decoded) return res.sendStatus(401);

        const userId = decoded.id;

        const friends = await prisma.users.findMany({
            where: {
                OR: [
                    {
                        friend_requests_to: {
                            some: {
                                from_user_id: userId,
                                status: "accepted",
                            },
                        },
                    },
                    {
                        friend_requests_from: {
                            some: {
                                to_user_id: userId,
                                status: "accepted",
                            },
                        },
                    },
                ],
            },
        });

        res.status(200).json(friends);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getUserInvite = async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
    if (!decoded) return res.sendStatus(401);

    // через Prisma
    const friendRequests = await prisma.friend_requests.findMany({
      where: {
        from_user_id: decoded.id,
        status: "pending",
      },
      include: {
        to_user: true, // подтягиваем юзера, которому заявка отправлена
      },
    });

    // возвращаем именно список пользователей (аналог u.* из SQL)
    const friends = friendRequests.map(fr => fr.to_user);

    res.status(200).json(friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUsersInviteMe = async (req: Request, res: Response) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.sendStatus(401);

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
        ) as any;
        if (!decoded) return res.sendStatus(401);

        const userId = decoded.id;

        const invites = await prisma.users.findMany({
            where: {
                friend_requests_from: {
                    some: {
                        to_user_id: userId,
                        status: "pending",
                    },
                },
            },
        });

        res.status(200).json(invites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const friendInvite = async (req: Request, res: Response) => {
  const id_user = Number(req.params.id);

  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
    if (!decoded) return res.sendStatus(401);

    // проверка на существующую заявку в любую сторону
    const existing = await prisma.friend_requests.findFirst({
      where: {
        OR: [
          { from_user_id: decoded.id, to_user_id: id_user },
          { from_user_id: id_user, to_user_id: decoded.id },
        ],
      },
    });

    if (existing) {
      return res.status(401).json({ message: "no" });
    }

    // создаём заявку
    await prisma.friend_requests.create({
      data: {
        from_user_id: decoded.id,
        to_user_id: id_user,
        status: "pending",
      },
    });

    res.json({ message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "need refresh" });
  }
};

const confirmFriendInvite = async (req: Request, res: Response) => {
    const id_user = Number(req.params.id);

    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.sendStatus(401);
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
        ) as any;
        if (!decoded) return res.sendStatus(401);

        // Обновляем статус приглашения
        await prisma.friend_requests.updateMany({
            where: {
                from_user_id: id_user,
                to_user_id: decoded.id,
            },
            data: {
                status: "accepted",
            },
        });

        res.json({ message: "Success" });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "need refresh" });
    }
};

const rejectFriendInvite = async (req: Request, res: Response) => {
    const id_user = Number(req.params.id);

    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.sendStatus(401);
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
        ) as any;
        if (!decoded) return res.sendStatus(401);

        await prisma.friend_requests.deleteMany({
            where: {
                from_user_id: id_user,
                to_user_id: decoded.id,
            },
        });

        res.json({ message: "Success" });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "need refresh" });
    }
};

const deleteFriend = async (req: Request, res: Response) => {
    const id_user = Number(req.params.id);

    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.sendStatus(401);
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
        if (!decoded) return res.sendStatus(401);

        await prisma.friend_requests.deleteMany({
            where: {
                OR: [
                    { from_user_id: decoded.id, to_user_id: id_user, status: "accepted" },
                    { from_user_id: id_user, to_user_id: decoded.id, status: "accepted" },
                ],
            },
        });

        res.json({ message: "Friend removed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getFriendStatus = async (req: Request, res: Response) => {
    const id_user = Number(req.params.id);

    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.sendStatus(401);
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
        if (!decoded) return res.sendStatus(401);

        const relation = await prisma.friend_requests.findFirst({
            where: {
                OR: [
                    { from_user_id: decoded.id, to_user_id: id_user },
                    { from_user_id: id_user, to_user_id: decoded.id },
                ],
            },
        });

        if (!relation) {
            return res.json({ status: "none" }); // нет отношений
        }

        res.json({ status: relation.status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export {
    getUsersFriends,
    getUserInvite,
    friendInvite,
    getUsersInviteMe,
    confirmFriendInvite,
    rejectFriendInvite,
    deleteFriend,
    getFriendStatus,
};
