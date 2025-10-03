import { Router } from "express";
import {
  searchUsers,
  searchServers,
  searchMessages,
} from "../controllers/search.controller";

export const searchRouter = Router();

searchRouter.get("/users", searchUsers);
searchRouter.get("/servers", searchServers);
searchRouter.get("/messages", searchMessages);
