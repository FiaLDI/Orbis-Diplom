import express from "express";

import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserChats,
} from "../controllers/userController";

export const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/search", getUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", createUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.get("/:id/chats", getUserChats);