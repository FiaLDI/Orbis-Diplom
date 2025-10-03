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

friendRouter.post("/friend/:id/invite", friendInvite);
friendRouter.get("/friend/invme", getUsersInviteMe);
friendRouter.get("/friend/invi", getUserInvite);
friendRouter.get("/friend", getUsersFriends);
friendRouter.get("/friend/:id/status", getFriendStatus);
friendRouter.post("/friend/:id/confirm", confirmFriendInvite);
friendRouter.post("/friend/:id/reject", rejectFriendInvite);
friendRouter.delete("/friend/:id", deleteFriend);   
