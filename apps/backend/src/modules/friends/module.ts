import { FriendController } from "./controllers/friend.controller";
import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { AuthMiddleware } from "@/middleware/auth.middleware";

export const friendModule = () => {
    const router = express.Router();
    const controller = container.get<FriendController>(TYPES.FriendController);
    const auth = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

    router.get("/", auth.handle.bind(auth), controller.getUserFriends.bind(controller));
    router.get("/requests", auth.handle.bind(auth), controller.getFriendRequests.bind(controller));
    router.get("/:id/status", auth.handle.bind(auth), controller.getFriendStatus.bind(controller));
    router.get("/blocked", auth.handle.bind(auth), controller.getUserBlocks.bind(controller));

    router.post("/:id/invite", auth.handle.bind(auth), controller.friendInvite.bind(controller));
    router.post("/:id/confirm", auth.handle.bind(auth), controller.friendConfirm.bind(controller));
    router.post("/:id/reject", auth.handle.bind(auth), controller.friendReject.bind(controller));
    router.post("/:id/block", auth.handle.bind(auth), controller.blockUser.bind(controller));
    router.post("/:id/unblock", auth.handle.bind(auth), controller.unBlockUser.bind(controller));

    router.delete("/:id", auth.handle.bind(auth), controller.friendDelete.bind(controller));

    return router;
};
