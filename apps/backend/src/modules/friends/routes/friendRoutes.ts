import express from "express";

import {
    friendInvite,
    rejectFriendInvite,
    confirmFriendInvite,
    getUsersInviteMe,
    getUserInvite
} from "../controllers/friendController";

export const friendRouter = express.Router();

friendRouter.post("/friend/:id/invite", friendInvite)
friendRouter.get("/friend/invme", getUsersInviteMe);
friendRouter.get("/friend/invi", getUserInvite);
friendRouter.post("/friend/:id/confirm", confirmFriendInvite);
friendRouter.post("/friend/:id/reject", rejectFriendInvite);
