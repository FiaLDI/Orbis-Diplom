import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { FriendController } from "./controllers/friend.controller";
import { AuthMiddleware } from "@/middleware/auth.middleware";

const controller = container.get<FriendController>(TYPES.FriendController);
const auth = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
export const friendModule = express.Router();

friendModule.get("/", auth.handle.bind(auth), controller.getUserFriends.bind(controller));
friendModule.get(
    "/requests",
    auth.handle.bind(auth),
    controller.getFriendRequests.bind(controller)
);
friendModule.get(
    "/:id/status",
    auth.handle.bind(auth),
    controller.getFriendStatus.bind(controller)
);
friendModule.get("/blocked", auth.handle.bind(auth), controller.getUserBlocks.bind(controller));

friendModule.post(
    "/:id/invite",
    auth.handle.bind(auth),
    controller.getUserFriends.bind(controller)
);
friendModule.post(
    "/:id/confirm",
    auth.handle.bind(auth),
    controller.friendConfirm.bind(controller)
);
friendModule.post("/:id/reject", auth.handle.bind(auth), controller.friendReject.bind(controller));
friendModule.post("/:id/block", auth.handle.bind(auth), controller.blockUser.bind(controller));
friendModule.post("/:id/unblock", auth.handle.bind(auth), controller.unBlockUser.bind(controller));

friendModule.delete("/:id", auth.handle.bind(auth), controller.friendDelete.bind(controller));
// friendModule.post("/:id/reject", rejectFriendInvite);
// friendModule.delete("/:id", deleteFriend);
// friendModule.post("/:id/block", blockUser);
// friendModule.post("/friends/:id/unblock", unblockUser);
