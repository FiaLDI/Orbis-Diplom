import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { ioChat } from "@/server";
import { prisma } from "@/config";
import { AuthRequest } from "@/modules/auth";


export const getMessages = async (req: AuthRequest, res: Response) => {
  const chatId = parseInt(req.params.id);
  const offset = Number(req.query.offset) || 0;

  if (isNaN(chatId)) {
    return res.status(400).json({ message: "Invalid chat_id" });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Проверяем доступ
    const serverChat = await prisma.server_chats.findFirst({
      where: { id_chats: chatId },
      select: { id_server: true },
    });

    let hasAccess = false;

    if (serverChat) {
      const inServer = await prisma.user_server.findFirst({
        where: {
          user_id: req.user.id,
          server_id: serverChat.id_server,
        },
      });
      hasAccess = !!inServer;
    } else {
      const inChat = await prisma.chat_users.findFirst({
        where: {
          chat_id: chatId,
          user_id: req.user.id,
        },
      });
      hasAccess = !!inChat;
    }

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied to this chat" });
    }

    // 💬 Загружаем сообщения
    const messages = await prisma.messages.findMany({
      where: { chat_id: chatId },
      orderBy: { created_at: "desc" },
      take: 20,
      skip: offset * 20,
      include: {
        user: { select: { id: true, username: true } },
        messages_content: {
          include: {
            content: { select: { id: true, text: true, url: true } },
          },
        },
      },
    });

    const formatted = messages.reverse().map((msg) => ({
      id: msg.id,
      chat_id: msg.chat_id,
      user_id: msg.user?.id ?? null,
      username: msg.user?.username ?? "Unknown",
      reply_to_id: msg.reply_to_id,
      is_edited: msg.is_edited ?? false,
      content: msg.messages_content.map((mc) => ({
        type: mc.type,
        id: mc.content.id,
        text: mc.content.text ?? "",
        url: mc.content.url ?? "",
      })),
      // ✅ теперь ISO вместо toLocaleTimeString
      timestamp: msg.created_at ? msg.created_at.toISOString() : null,
      updated_at: msg.updated_at ? msg.updated_at.toISOString() : null,
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ getMessages error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessages = async (req: AuthRequest, res: Response) => {
  const { chat_id, content, reply_to_id } = req.body;
  const user = req.user;

  try {
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Array.isArray(content) || content.length === 0) {
      return res
        .status(400)
        .json({ message: "content must be a non-empty array" });
    }

    const contentsRow: any[] = [];

    for (const item of content) {
      const contentId = uuidv4();

      const createdContent = await prisma.content.create({
        data: {
          id: contentId,
          text: item.text ?? null,
          url: item.url ?? null,
        },
      });

      contentsRow.push({
        id: createdContent.id,
        type: item.type,
        text: createdContent.text,
        url: createdContent.url,
      });
    }

    const message = await prisma.messages.create({
      data: {
        chat_id: Number(chat_id),
        user_id: user.id,
        reply_to_id: reply_to_id ? Number(reply_to_id) : null,
        is_edited: false,
        created_at: new Date(),
        messages_content: {
          create: contentsRow.map((content) => ({
            id_content: content.id,
            type: content.type,
            uploaded_at: new Date(),
            size: null,
          })),
        },
      },
    });

    const fullMessage = {
      id: message.id,
      chat_id,
      user_id: user.id,
      username: user.username,
      reply_to_id: message.reply_to_id
        ? Number(message.reply_to_id)
        : null,
      is_edited: message.is_edited,
      content: contentsRow,
      // ✅ теперь ISO
      timestamp: message.created_at ? message.created_at.toISOString() : "",
      updated_at: null,
    };

    ioChat.to(`chat_${chat_id}`).emit("new-message", fullMessage);

    return res.status(200).json(fullMessage);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteMessage = async (req: AuthRequest, res: Response) => {
  const messageId = parseInt(req.params.id, 10);

  if (isNaN(messageId)) {
    return res.status(400).json({ message: "Invalid message_id" });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const message = await prisma.messages.findUnique({
      where: { id: messageId },
      select: { user_id: true, chat_id: true },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const chatId = message.chat_id!;

    await prisma.$transaction(async (tx) => {
      const contentLinks = await tx.messages_content.findMany({
        where: { id_messages: messageId },
        select: { id_content: true },
      });

      await tx.messages_content.deleteMany({
        where: { id_messages: messageId },
      });

      const contentIds = contentLinks.map((c) => c.id_content);
      if (contentIds.length) {
        await tx.content.deleteMany({
          where: { id: { in: contentIds } },
        });
      }

      await tx.messages.delete({ where: { id: messageId } });
    });

    ioChat.to(`chat_${chatId}`).emit("delete-message", { message_id: messageId });

    return res.status(200).json({ message: "Confirm Delete" });
  } catch (err) {
    console.error("❌ deleteMessage error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const editMessage = async (req: AuthRequest, res: Response) => {
  const messageId = parseInt(req.params.id, 10);

  if (isNaN(messageId)) {
    return res.status(400).json({ message: "Invalid message_id" });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const message = await prisma.messages.findUnique({
      where: { id: messageId },
      include: {
        messages_content: { include: { content: true } },
      },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { content } = req.body;
    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        message: "Content is required and must be a non-empty string",
      });
    }

    const contentId = message.messages_content[0]?.id_content;
    if (!contentId) {
      return res.status(404).json({ message: "Message content not found" });
    }

    const updatedContent = await prisma.content.update({
      where: { id: contentId },
      data: { text: content },
    });

    await prisma.messages.update({
      where: { id: messageId },
      data: { is_edited: true, updated_at: new Date() },
    });

    ioChat.to(`chat_${message.chat_id}`).emit("edit-message", {
      message_id: messageId,
      newContent: updatedContent.text,
    });

    return res.status(200).json({
      message: "Message updated",
      data: updatedContent,
    });
  } catch (err) {
    console.error("❌ editMessage error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessageById = async (req: AuthRequest, res: Response) => {
  const messageId = parseInt(req.params.id, 10);

  if (isNaN(messageId)) {
    return res.status(400).json({ message: "Invalid message id" });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const message = await prisma.messages.findUnique({
      where: { id: messageId },
      include: {
        user: { select: { id: true, username: true } },
        messages_content: {
          include: { content: true },
        },
      },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const formatted = {
      id: message.id,
      chat_id: message.chat_id,
      user_id: message.user?.id ?? null,
      username: message.user?.username ?? "Unknown",
      reply_to_id: message.reply_to_id,
      is_edited: message.is_edited,
      content: message.messages_content.map((mc) => ({
        type: mc.type,
        id: mc.content.id,
        text: mc.content.text ?? "",
        url: mc.content.url ?? "",
      })),
      timestamp: message.created_at
        ? new Date(message.created_at).toLocaleTimeString()
        : null,
      updated_at: message.updated_at
        ? new Date(message.updated_at).toLocaleTimeString()
        : null,
    };

    return res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ getMessageById error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

