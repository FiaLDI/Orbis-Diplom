import express from "express";

import {
    friendInvite,
    rejectFriendInvite,
    confirmFriendInvite,
    getUsersInviteMe,
    getUserInvite,
    getUsersFriends,
    getFriendStatus,
    deleteFriend
} from "../controllers/friend.controller";

export const friendRouter = express.Router();

friendRouter.post("/:id/invite", friendInvite);
friendRouter.get("/invme", getUsersInviteMe);
friendRouter.get("/invi", getUserInvite);
friendRouter.get("/", getUsersFriends);
friendRouter.get("/:id/status", getFriendStatus);
friendRouter.post("/:id/confirm", confirmFriendInvite);
friendRouter.post("/:id/reject", rejectFriendInvite);
friendRouter.delete("/:id", deleteFriend);   
