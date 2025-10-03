import { Router } from "express";
import { getChats, getChatById, createChat, updateChat, deleteChat, startChat } from "../controllers/chat.controller";

const chatRouter = Router();

chatRouter.get("/", getChats);          
chatRouter.get("/:id", getChatById);
chatRouter.post("/", createChat);
chatRouter.put("/:id", updateChat);
chatRouter.delete("/:id", deleteChat);
chatRouter.post("/start/:id", startChat);
chatRouter.get("/unread")

export default chatRouter;