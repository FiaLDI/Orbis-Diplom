import { Request, Response } from "express";
import { prisma } from "@/config";

// --- Поиск пользователей (друзья + общие сервера) ---
export const searchUsers = async (req: any, res: Response) => {
  const q = String(req.query.q || "").trim();
  const userId = req.user?.id;

  if (!q) return res.status(400).json({ message: "Query is required" });
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const serverIds = (
      await prisma.user_server.findMany({
        where: { user_id: userId },
        select: { server_id: true },
      })
    ).map((us) => us.server_id);

    // друзья
    const friends = await prisma.users.findMany({
      where: {
        AND: [
          {
            OR: [
              { friend_requests_to: { some: { from_user_id: userId, status: "accepted" } } },
              { friend_requests_from: { some: { to_user_id: userId, status: "accepted" } } },
            ],
          },
          {
            OR: [
              { username: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          },
        ],
      },
      select: { id: true, username: true, email: true, user_profile: { select: { avatar_url: true } } },
    });

    // общие сервера
    const shared = await prisma.users.findMany({
      where: {
        AND: [
          { user_server: { some: { server_id: { in: serverIds } } } },
          {
            OR: [
              { username: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          },
        ],
      },
      select: { id: true, username: true, email: true, user_profile: { select: { avatar_url: true } } },
    });

    const all = [...friends, ...shared];
    const unique = Array.from(new Map(all.map((u) => [u.id, u])).values());

    res.json(unique.slice(0, 20));
  } catch (err) {
    console.error("searchUsers error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// --- Поиск серверов (только где состоит пользователь) ---
export const searchServers = async (req: any, res: Response) => {
  const q = String(req.query.q || "").trim();
  const userId = req.user?.id;

  if (!q) return res.status(400).json({ message: "Query is required" });
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const servers = await prisma.servers.findMany({
      where: {
        AND: [
          { user_server: { some: { user_id: userId } } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, avatar_url: true },
      take: 20,
    });

    res.json(servers);
  } catch (err) {
    console.error("searchServers error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// --- Поиск сообщений (только в чатах пользователя) ---
export const searchMessages = async (req: any, res: Response) => {
  const q = String(req.query.q || "").trim();
  const userId = req.user?.id;

  if (!q) return res.status(400).json({ message: "Query is required" });
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const chatIds = (
      await prisma.chat_users.findMany({
        where: { user_id: userId },
        select: { chat_id: true },
      })
    ).map((c) => c.chat_id);

    if (chatIds.length === 0) return res.json([]);

    const messages = await prisma.messages.findMany({
      where: {
        AND: [
          { chat_id: { in: chatIds } },
          { content_text: { contains: q, mode: "insensitive" } },
        ],
      },
      include: {
        user: { select: { id: true, username: true } },
        chat: { select: { id: true, name: true } },
      },
      orderBy: { created_at: "desc" },
      take: 20,
    });

    res.json(messages.map((m) => ({
      id: m.id,
      chat: m.chat,
      user: m.user,
      content: m.content_text,
      created_at: m.created_at,
    })));
  } catch (err) {
    console.error("searchMessages error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
