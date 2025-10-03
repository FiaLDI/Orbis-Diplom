import express from "express";

import {
    getMessages,
    sendMessages,
    deleteMessage,
    editMessage,
} from "../controllers/messagesController";

export const messagesRouter = express.Router();

messagesRouter.get("/chats/:id/messages", getMessages);
messagesRouter.post("/chats/:id/messages", sendMessages);

messagesRouter.delete("/message/", deleteMessage);
messagesRouter.put("/message/", editMessage);
