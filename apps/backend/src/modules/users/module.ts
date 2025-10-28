import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { UserController } from "./controllers/user.controller";
import { AuthMiddleware } from "@/middleware/auth.middleware";

const controller = container.get<UserController>(TYPES.UserController);
const auth = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
export const userModule = express.Router();

userModule.get("/:id", auth.handle.bind(auth), controller.getProfileById.bind(controller));
// userModule.put("/:id", updateUser);
// userModule.delete("/:id", deleteUser);
// userModule.get("/:id/chats", getUserChats);
// userModule.get("/search", getUsers);
