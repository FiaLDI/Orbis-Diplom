import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import type { UserController } from "./controllers/user.controller";
import type { AuthMiddleware } from "@/middleware/auth.middleware";

export const userModule = () => {
  const router = express.Router();

  const controller = container.get<UserController>(TYPES.UserController);
  const auth = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
    router.get("/chats", auth.handle.bind(auth), controller.getUserChats.bind(controller));
    router.get("/search", auth.handle.bind(auth), controller.searchUser.bind(controller));
    router.get("/:id", auth.handle.bind(auth), controller.getProfileById.bind(controller));
    router.put("/:id", auth.handle.bind(auth), controller.updateUser.bind(controller));
    router.delete("/:id", auth.handle.bind(auth), controller.deleteUser.bind(controller));

  return router;
};
