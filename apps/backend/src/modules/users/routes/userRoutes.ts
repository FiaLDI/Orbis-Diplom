import express from "express";

import {
    getUserInfo,
    getChats,
    startchat,
    getUserbyName,
} from "../controllers/userController";

export const userRouter = express.Router();

userRouter.get("/user/search", getUserbyName);
userRouter.get("/user/:id", getUserInfo);
userRouter.get("/chats/", getChats);
userRouter.post("/user/:id/chatstart", startchat);
