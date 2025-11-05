import "reflect-metadata";
import { Container } from "inversify";
import { PrismaClient } from "@prisma/client";
import { redisClient } from "@/config";
import { TYPES } from "./types";

// ===== Modules imports =====
import { AuthService } from "@/modules/auth/services/auth.service";
import { AuthController } from "@/modules/auth/controllers/auth.controller";
console.log("AuthService?", AuthService);
console.log("AuthController?", AuthController);
import { AuthMiddleware } from "@/middleware/auth.middleware";
import { RolePermissionMiddleware } from "@/middleware/role.permission.middleware";

import { FriendService } from "@/modules/friends/services/friend.service";
import { FriendController } from "@/modules/friends/controllers/friend.controller";

import { UserService } from "@/modules/users/services/user.service";
import { UserController } from "@/modules/users/controllers/user.controller";

import { NotificationService } from "@/modules/notifications/services/notification.service";
import { NotificationController } from "@/modules/notifications/controllers/notification.controller";

import { ChatService } from "@/modules/chat";
import { ChatController } from "@/modules/chat/controllers/chat.controller";

import { MessageService } from "@/modules/messages/services/message.service";
import { MessageController } from "@/modules/messages/controllers/message.controller";

import { ServerService } from "@/modules/servers/services/server.service";
import { ServerController } from "@/modules/servers/controllers/server.controller";

import { RolesService } from "@/modules/roles/services/roles.service";
import { RolesController } from "@/modules/roles/controllers/roles.controller";

import { PlanningController } from "@/modules/planning/controllers/planning.controller";
import { PlanningService } from "@/modules/planning/services/planning.service";

import { ModerationController } from "@/modules/moderation/controllers/moderation.controller";
import { ModerationService } from "@/modules/moderation/services/moderation.services";

// ===== Container setup =====
const container = new Container({ defaultScope: "Singleton" });

function safeBind<T>(symbol: symbol, clazz: new (...args: any[]) => T) {
    try {
        if (!clazz) {
            console.error(`❌ Cannot bind ${symbol.toString()}: provided class is undefined!`);
            return;
        }

        container.bind<T>(symbol).to(clazz);
        console.log(`✅ Bound: ${symbol.toString()} → ${clazz.name}`);
    } catch (err) {
        console.error(
            `❌ Failed to bind ${symbol.toString()} (${clazz ? clazz.name : "undefined"}):`,
            err
        );
    }
}

// Core dependencies
try {
    container.bind(TYPES.Prisma).toConstantValue(new PrismaClient());
    console.log("✅ Bound: PrismaClient instance");
} catch (err) {
    console.error("❌ Failed to bind PrismaClient:", err);
}

try {
    container.bind(TYPES.Redis).toConstantValue(redisClient);
    console.log("✅ Bound: Redis client");
} catch (err) {
    console.error("❌ Failed to bind Redis client:", err);
}

// ===== Services & Controllers =====
safeBind(TYPES.AuthService, AuthService);
safeBind(TYPES.AuthController, AuthController);

safeBind(TYPES.FriendService, FriendService);
safeBind(TYPES.FriendController, FriendController);

safeBind(TYPES.UserService, UserService);
safeBind(TYPES.UserController, UserController);

safeBind(TYPES.NotificationService, NotificationService);
safeBind(TYPES.NotificationController, NotificationController);

safeBind(TYPES.ChatService, ChatService);
safeBind(TYPES.ChatController, ChatController);

safeBind(TYPES.MessageService, MessageService);
safeBind(TYPES.MessageController, MessageController);

safeBind(TYPES.ServerService, ServerService);
safeBind(TYPES.ServerController, ServerController);

safeBind(TYPES.RolesService, RolesService);
safeBind(TYPES.RolesController, RolesController);

safeBind(TYPES.PlanningService, PlanningService);
safeBind(TYPES.PlanningController, PlanningController);

safeBind(TYPES.ModerationService, ModerationService);
safeBind(TYPES.ModerationController, ModerationController);

// ===== Middleware =====
safeBind(TYPES.AuthMiddleware, AuthMiddleware);
safeBind(TYPES.RolePermissionMiddleware, RolePermissionMiddleware);

console.log("🧩 All DI bindings attempted.");

export { container };
