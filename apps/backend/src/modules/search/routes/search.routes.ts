import { Router } from "express";
import {
  searchUsers,
  searchServers,
  searchMessages,
} from "../controllers/search.controller";
import { authenticate } from "@/modules/auth";

export const searchRouter = Router();

searchRouter.get("/users", authenticate, searchUsers);
searchRouter.get("/servers", authenticate, searchServers);
searchRouter.get("/messages", authenticate, searchMessages);
