import { ServerController } from "./controllers/server.controller";
import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { AuthMiddleware } from "@/middleware/auth.middleware";
import { RolePermissionMiddleware } from "@/middleware/role.permission.middleware";

export const serverModule = () => {
    const router = express.Router();
    const controller = container.get<ServerController>(TYPES.ServerController);
    const auth = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
    const rolePerm = container.get<RolePermissionMiddleware>(TYPES.RolePermissionMiddleware);

    router.get("", auth.handle.bind(auth), controller.getUserServers.bind(controller));
    router.post("", auth.handle.bind(auth), controller.createServerUser.bind(controller));
    router.get("/:id", auth.handle.bind(auth), controller.getServerInfo.bind(controller));
    router.get(
        "/:id/members",
        auth.handle.bind(auth),
        controller.getServerMembers.bind(controller)
    );
    router.post("/join", auth.handle.bind(auth), controller.joinServerUser.bind(controller));

    router.get(
        "/:id/link",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_INVITES"),
        controller.getInviteLinks.bind(controller)
    )

    router.post(
        "/:id/link",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_INVITES"),
        controller.createInviteLink.bind(controller)
    )

    router.delete(
        "/:id/link",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_INVITES"),
        controller.deleteInviteLink.bind(controller)
    )

    router.patch(
        "/:id",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_SERVER"),
        controller.updateServer.bind(controller)
    );

    router.delete(
        "/:id",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_SERVER"),
        controller.deleteServer.bind(controller)
    );

    router.delete(
        "/:id/members/:userId",
        auth.handle.bind(auth),
        rolePerm.check("KICK_USERS"),
        controller.kickMember.bind(controller)
    );

    router.post(
        "/:id/members/:userId/ban",
        auth.handle.bind(auth),
        rolePerm.check("BAN_USERS"),
        controller.banMember.bind(controller)
    );

    router.delete(
        "/:id/members/:userId/ban",
        auth.handle.bind(auth),
        rolePerm.check("UNBAN_USERS"),
        controller.unbanMember.bind(controller)
    );

    router.get(
        "/:id/chats",
        auth.handle.bind(auth),
        rolePerm.check("VIEW_CHATS"),
        controller.getServerChats.bind(controller)
    );
    router.post(
        "/:id/chats",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_CHATS"),
        controller.createChat.bind(controller)
    );
    router.get(
        "/:id/chats/:chatId",
        auth.handle.bind(auth),
        rolePerm.check("VIEW_CHATS"),
        controller.getChatInfo.bind(controller)
    );
    router.delete(
        "/:id/chats/:chatId",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_CHATS"),
        controller.deleteChat.bind(controller)
    );

    return router;
};
