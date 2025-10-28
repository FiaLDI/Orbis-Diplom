import express from "express";

import {
    getServers,
    getServerInfo,
    createServer,
    joinServer,
    createChat,
    updateServer,
    deleteServer,
    kickMember,
    banMember,
    unbanMember,
    getServerChats,
    getChatInfo,
    deleteChat,
    getServerMembers,
} from "../controllers/server.controller";

export const serverRouter = express.Router();

serverRouter.get("", getServers);
serverRouter.post("", createServer);
serverRouter.get("/:id", getServerInfo);
serverRouter.patch("/:id", updateServer);
serverRouter.delete("/:id", deleteServer);

serverRouter.get("/:id/members", getServerMembers);
serverRouter.post("/:id/join", joinServer);
serverRouter.delete("/:id/members/:userId", kickMember);
serverRouter.post("/:id/members/:userId/ban", banMember);
serverRouter.delete("/:id/members/:userId/ban", unbanMember);

serverRouter.get("/:id/chats", getServerChats);
serverRouter.post("/:id/chats", createChat);
serverRouter.get("/:id/chats/:chatId", getChatInfo);
serverRouter.delete("/:id/chats/:chatId", deleteChat);
