import express from "express";

import {
    getMessages,
    sendMessages,
    deleteMessage,
    editMessage,
    getMessageById,
} from "../controllers/messagesController";

export const messagesRouter = express.Router();

messagesRouter.get("/chats/:chatId/messages", getMessages);
messagesRouter.post("/chats/:chatId/messages", sendMessages);
messagesRouter.get("/:id", getMessageById);
messagesRouter.put("/:id", editMessage);
messagesRouter.delete("/:id", deleteMessage);

