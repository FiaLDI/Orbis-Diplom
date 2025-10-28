import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authModule } from "@/modules/auth/module";

import { ENVCONFIG } from "@/config";
import { errorHandler } from "./middleware/error.middleware";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { friendModule } from "./modules/friends/module";
import { userModule } from "./modules/users";
import { notificationModule } from "./modules/notifications";

export const app = express();

// middlewares
app.use(
    cors({
        origin: ENVCONFIG.FRONTENDADDRES,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());

// routes
app.use("/api/auth", authModule);
// app.use("/api/chats", chatRouter);
app.use("/api/friends", friendModule);
// app.use("/api/messages", messagesRouter);
// app.use("/api/moderation", moderationRouter);
app.use("/api/notifications", notificationModule);
// app.use("/api/servers", rolesRouter);
// app.use("/api/search", searchRouter);
// app.use("/api/servers", serverRouter);
app.use("/api/users", userModule);
// app.use("/api/servers", planningRouter);

app.use(errorHandler);
