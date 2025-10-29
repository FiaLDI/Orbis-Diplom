import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { UserController } from "./controllers/user.controller";
import { AuthMiddleware } from "@/middleware/auth.middleware";

const controller = container.get<UserController>(TYPES.UserController);
const auth = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
export const userModule = express.Router();

userModule.get("/chats", auth.handle.bind(auth), controller.getUserChats.bind(controller));
userModule.get("/search", auth.handle.bind(auth), controller.searchUser.bind(controller));
userModule.get("/:id", auth.handle.bind(auth), controller.getProfileById.bind(controller));
userModule.put("/:id", auth.handle.bind(auth), controller.updateUser.bind(controller));
userModule.delete("/:id", auth.handle.bind(auth), controller.deleteUser.bind(controller));
