import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "@/config";
import bcrypt from "bcrypt";
import { emitNotification } from "@/socket";
import { sendNotification } from "@/utils/sendNotification";

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
          some: { from_user_id: userId, status: "accepted" },
        },
      },
      {
        friend_requests_from: {
          some: { to_user_id: userId, status: "accepted" },
        },
      },
    ],
  },
  include: {
    user_profile: { select: { avatar_url: true } },
    users_blocks: {
      where: { id_users: userId },
      select: { id_users: true },
    },
  },
});

const result = friends.map((f) => ({
  id: f.id,
  username: f.username,
  email: f.email,
  avatar_url: f.user_profile?.avatar_url ?? null,
  is_blocked: f.users_blocks.length > 0,
}));



    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const getFriendRequests = async (req: Request, res: Response) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
    if (!decoded) return res.sendStatus(401);

    const userId = decoded.id;
    const direction = req.query.direction as string;

    if (!direction || !["incoming", "outcoming"].includes(direction)) {
      return res.status(400).json({ message: "Invalid direction param" });
    }

    let result;

    if (direction === "outcoming") {
      const requests = await prisma.friend_requests.findMany({
        where: {
          from_user_id: userId,
          status: "pending",
        },
        include: {
          to_user: {
            include: {
              user_profile: {
                select: {
                  avatar_url: true,
                  first_name: true,
                  last_name: true,
                },
              },
            },
          },
        },
      });

      result = requests.map((r) => ({
        id: r.to_user.id,
        username: r.to_user.username,
        email: r.to_user.email,
        avatar_url: r.to_user.user_profile?.avatar_url ?? null,
        first_name: r.to_user.user_profile?.first_name ?? null,
        last_name: r.to_user.user_profile?.last_name ?? null,
      }));
    } else {
      const requests = await prisma.friend_requests.findMany({
        where: {
          to_user_id: userId,
          status: "pending",
        },
        include: {
          from_user: {
            include: {
              user_profile: {
                select: {
                  avatar_url: true,
                  first_name: true,
                  last_name: true,
                },
              },
            },
          },
        },
      });

      result = requests.map((r) => ({
        id: r.from_user.id,
        username: r.from_user.username,
        email: r.from_user.email,
        avatar_url: r.from_user.user_profile?.avatar_url ?? null,
        first_name: r.from_user.user_profile?.first_name ?? null,
        last_name: r.from_user.user_profile?.last_name ?? null,
      }));
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const friendInvite = async (req: Request, res: Response) => {
  const id_user = Number(req.params.id);

  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
    if (!decoded) return res.sendStatus(401);

    // Проверка на существующую заявку
    const existing = await prisma.friend_requests.findFirst({
      where: {
        OR: [
          { from_user_id: decoded.id, to_user_id: id_user },
          { from_user_id: id_user, to_user_id: decoded.id },
        ],
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Request already exists" });
    }

    // Создаём заявку
    const request = await prisma.friend_requests.create({
      data: {
        from_user_id: decoded.id,
        to_user_id: id_user,
        status: "pending",
      },
      include: {
        from_user: { select: { username: true, id: true } },
      },
    });

    await sendNotification(id_user, {
      type: "friend_request",
      title: "Friend Request",
      body: `${request.from_user.username} sent you a friend request`,
      data: { from_user_id: decoded.id },
    });

    res.json({ message: "Success" });
  } catch (err) {
    console.error("friendInvite error:", err);
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

    // Проверяем, что заявка существует и в статусе "pending"
    const existing = await prisma.friend_requests.findFirst({
      where: {
        from_user_id: id_user,
        to_user_id: decoded.id,
        status: "pending",
      },
      include: {
        from_user: { select: { username: true, id: true } },
        to_user: { select: { username: true, id: true } },
      },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Friend request not found or already processed" });
    }

    // Обновляем статус на accepted
    await prisma.friend_requests.updateMany({
      where: {
        from_user_id: id_user,
        to_user_id: decoded.id,
      },
      data: {
        status: "accepted",
      },
    });

    await sendNotification(id_user, {
      type: "friend_accept",
      title: "Friend Request Accepted",
      body: `${existing.to_user.username} accepted your friend request`,
      data: { to_user_id: decoded.id },
    });

    res.json({ message: "Success" });
  } catch (err) {
    console.error("confirmFriendInvite error:", err);
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

    // Проверяем, что существует активная заявка
    const existing = await prisma.friend_requests.findFirst({
      where: {
        from_user_id: id_user,
        to_user_id: decoded.id,
        status: "pending",
      },
      include: {
        from_user: { select: { username: true, id: true } },
        to_user: { select: { username: true, id: true } },
      },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Friend request not found or already processed" });
    }

    // Удаляем заявку
    await prisma.friend_requests.deleteMany({
      where: {
        from_user_id: id_user,
        to_user_id: decoded.id,
        status: "pending",
      },
    });

    await sendNotification(id_user, {
      type: "friend_reject",
      title: "Friend Request Rejected",
      body: `${existing.to_user.username} accepted your friend request`,
      data: { to_user_id: decoded.id },
    });

    res.json({ message: "Success" });
  } catch (err) {
    console.error("rejectFriendInvite error:", err);
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

const blockUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.sendStatus(401);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
    if (!decoded) return res.sendStatus(401);

    const targetUserId = Number(req.params.id);
    const userId = decoded.id;

    if (targetUserId === userId) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    // Проверяем, не заблокирован ли уже
    const existing = await prisma.users_blocks.findFirst({
      where: { id_users: userId, reason_type_id: targetUserId },
    });

    if (existing) {
      return res.status(400).json({ message: "User already blocked" });
    }

    // Создаём тип причины, если нет
    const defaultReason =
      (await prisma.block_reason_type.findFirst({
        where: { name: "Manual Block" },
      })) ||
      (await prisma.block_reason_type.create({
        data: { name: "Manual Block" },
      }));

    // ✅ Создаём запись о блокировке
    await prisma.users_blocks.create({
      data: {
        id_users: userId, // кто блокирует
        reason_type_id: defaultReason.id,
        created_at: new Date(),
        end_at: null,
      },
    });

    res.json({ message: "User blocked successfully" });
  } catch (err) {
    console.error("blockUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const unblockUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.sendStatus(401);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
    if (!decoded) return res.sendStatus(401);

    const targetUserId = Number(req.params.id);
    const userId = decoded.id;

    await prisma.users_blocks.deleteMany({
      where: { id_users: userId, reason_type_id: targetUserId },
    });

    res.json({ message: "User unblocked successfully" });
  } catch (err) {
    console.error("unblockUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export {
    getUsersFriends,
    getFriendRequests,
    friendInvite,
    confirmFriendInvite,
    rejectFriendInvite,
    deleteFriend,
    getFriendStatus,
    blockUser,
    unblockUser,
};
