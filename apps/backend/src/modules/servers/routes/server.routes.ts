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

serverRouter.get("/servers", getServers);
serverRouter.post("/servers", createServer);
serverRouter.get("/servers/:id", getServerInfo);
serverRouter.patch("/servers/:id", updateServer);
serverRouter.delete("/servers/:id", deleteServer);

// Работа с участниками (members)
serverRouter.get("/servers/:id/members", getServerMembers);
serverRouter.post("/servers/:id/join", joinServer); 
serverRouter.delete("/servers/:id/members/:userId", kickMember);
serverRouter.post("/servers/:id/members/:userId/ban", banMember);
serverRouter.delete("/servers/:id/members/:userId/ban", unbanMember);

// Работа с чатами внутри сервера
serverRouter.get("/servers/:id/chats", getServerChats);
serverRouter.post("/servers/:id/chats", createChat);
serverRouter.get("/servers/:id/chats/:chatId", getChatInfo);
serverRouter.delete("/servers/:id/chats/:chatId", deleteChat);

// serverRouter.get("/servers/:id/roles", getServerRoles); 
// serverRouter.post("/servers/:id/roles", createRole); 
// serverRouter.patch("/servers/:id/roles/:roleId", updateRole); 
// serverRouter.delete("/servers/:id/roles/:roleId", deleteRole);
