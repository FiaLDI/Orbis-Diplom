import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authModule } from "@/modules/auth/module";

import { ENVCONFIG } from "@/config";
import { errorHandler } from "./middleware/error.middleware";
import { friendModule } from "./modules/friends/module";
import { userModule } from "./modules/users";
import { notificationModule } from "./modules/notifications";
import { chatModule, messageModule } from "./modules";
import { serverModule } from "./modules/servers/module";
import { rolesModule } from "./modules/roles/module";
import { planningModule } from "./modules/planning/module";
import { moderationModule } from "./modules/moderation/module";

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
app.use("/api/auth", authModule());
app.use("/api/chats", chatModule());
app.use("/api/friends", friendModule());
app.use("/api/messages", messageModule());
app.use("/api/notifications", notificationModule());
app.use("/api/users", userModule());

// all server-scoped modules share one prefix
app.use("/api/servers", serverModule());
app.use("/api/servers", rolesModule());
app.use("/api/servers", planningModule());
app.use("/api/servers", moderationModule());

// error middleware last
app.use(errorHandler);
