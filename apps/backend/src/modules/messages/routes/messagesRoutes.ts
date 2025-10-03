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
messagesRouter.get("/messages/:id", getMessageById);
messagesRouter.put("/messages/:id", editMessage);
messagesRouter.delete("/messages/:id", deleteMessage);

