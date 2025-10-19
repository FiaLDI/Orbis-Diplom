import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { 
  authRoutes, 
  chatRouter, 
  moderationRouter, 
  notificationRouter, 
  planningRouter, 
  rolesRouter, 
  searchRouter,
  userRouter,
  messagesRouter,
  friendRouter,
  serverRouter
} from "@/modules";
import { ENVCONFIG } from "@/config";

export const app = express();

// middlewares
app.use(
  cors({
    origin: ENVCONFIG.FRONTENDADDRES,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRouter);
app.use("/api/friends", friendRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/moderation", moderationRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/servers", rolesRouter);
app.use("/api/search", searchRouter);
app.use("/api/servers", serverRouter);
app.use("/api/users", userRouter);
app.use("/api/servers", planningRouter);
