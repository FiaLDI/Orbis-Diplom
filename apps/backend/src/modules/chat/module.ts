import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import type { ChatController } from "./controllers/chat.controller";
import { AuthMiddleware } from "@/middleware/auth.middleware";

export const chatModule = () => {
  const router = express.Router();
  const controller = container.get<ChatController>(TYPES.ChatController);
  const auth = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

  router.put("/:id", auth.handle.bind(auth), controller.updateChat.bind(controller));
  router.delete("/:id", auth.handle.bind(auth), controller.deleteChat.bind(controller));
  router.post("/start/:id", auth.handle.bind(auth), controller.startChat.bind(controller));

  return router;
};
