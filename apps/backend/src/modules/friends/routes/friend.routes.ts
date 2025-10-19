import express from "express";

import {
    friendInvite,
    rejectFriendInvite,
    confirmFriendInvite,
    getFriendRequests,
    getUsersFriends,
    getFriendStatus,
    deleteFriend,
  blockUser,
  unblockUser,
} from "../controllers/friend.controller";

export const friendRouter = express.Router();

friendRouter.post("/:id/invite", friendInvite);
friendRouter.get("/requests", getFriendRequests);
friendRouter.get("/", getUsersFriends);
friendRouter.get("/:id/status", getFriendStatus);
friendRouter.post("/:id/confirm", confirmFriendInvite);
friendRouter.post("/:id/reject", rejectFriendInvite);
friendRouter.delete("/:id", deleteFriend);   
friendRouter.post("/:id/block", blockUser);
friendRouter.post("/friends/:id/unblock", unblockUser);