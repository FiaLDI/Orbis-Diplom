import express from "express";

import {
    getMessages,
    sendMessages,
    deleteMessage,
    editMessage,
    getMessageById,
} from "../controllers/messagesController";
import { authenticate } from "@/modules/auth";

export const messagesRouter = express.Router();

messagesRouter.use(authenticate);
messagesRouter.get("/chats/:id/messages", getMessages);
messagesRouter.post("/chats/:id/messages", sendMessages);
messagesRouter.get("/:id", getMessageById);
messagesRouter.put("/:id", editMessage);
messagesRouter.delete("/:id", deleteMessage);

