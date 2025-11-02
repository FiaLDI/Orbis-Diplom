import { ServerController } from "./controllers/server.controller";
import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { AuthMiddleware } from "@/middleware/auth.middleware";

export const serverModule = () => {
    const router = express.Router();
    const controller = container.get<ServerController>(TYPES.ServerController);
    const auth = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

    router.get("", auth.handle.bind(auth), controller.getUserServers.bind(controller));
    router.post("", auth.handle.bind(auth), controller.createServerUser.bind(controller));
    router.get("/:id", auth.handle.bind(auth), controller.getServerInfo.bind(controller));
    // router.patch("/:id", auth.handle.bind(auth), controller.updateServer.bind(controller));
    // router.delete("/:id", auth.handle.bind(auth), controller.deleteServer.bind(controller));

    // router.get("/:id/members", auth.handle.bind(auth), controller.getServerMembers.bind(controller));
    router.post("/:id/join", auth.handle.bind(auth), controller.joinServerUser.bind(controller));
    // router.delete("/:id/members/:userId", auth.handle.bind(auth), controller.kickMember.bind(controller));
    // router.post("/:id/members/:userId/ban", auth.handle.bind(auth), controller.banMember.bind(controller));
    // router.delete("/:id/members/:userId/ban", auth.handle.bind(auth), controller.unbanMember.bind(controller));

    // router.get("/:id/chats", auth.handle.bind(auth), controller.getServerChats.bind(controller));
    // router.post("/:id/chats", auth.handle.bind(auth), controller.createChat.bind(controller));
    // router.get("/:id/chats/:chatId", auth.handle.bind(auth), controller.getChatInfo.bind(controller));
    // router.delete("/:id/chats/:chatId", auth.handle.bind(auth), controller.deleteChat.bind(controller));

    return router;
};
