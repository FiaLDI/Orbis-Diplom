import "reflect-metadata";
import { Container } from "inversify";
import { PrismaClient } from "@prisma/client";
import { redisClient } from "@/config";
import { TYPES } from "./types";

import { AuthService } from "@/modules/auth/services/auth.service";
import { AuthController } from "@/modules/auth/controllers/auth.controller";
import { AuthMiddleware } from "@/middleware/auth.middleware";

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

const container = new Container({ defaultScope: "Singleton" });

container.bind(TYPES.Prisma).toConstantValue(new PrismaClient());
container.bind(TYPES.Redis).toConstantValue(redisClient);

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

container.bind<FriendService>(TYPES.FriendService).to(FriendService);
container.bind<FriendController>(TYPES.FriendController).to(FriendController);

container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserController>(TYPES.UserController).to(UserController);

container.bind<NotificationService>(TYPES.NotificationService).to(NotificationService);
container.bind<NotificationController>(TYPES.NotificationController).to(NotificationController);

container.bind<ChatService>(TYPES.ChatService).to(ChatService);
container.bind<ChatController>(TYPES.ChatController).to(ChatController);

container.bind<MessageService>(TYPES.MessageService).to(MessageService);
container.bind<MessageController>(TYPES.MessageController).to(MessageController);

container.bind<ServerService>(TYPES.ServerService).to(ServerService);
container.bind<ServerController>(TYPES.ServerController).to(ServerController);

container.bind<RolesService>(TYPES.RolesService).to(RolesService);
container.bind<RolesController>(TYPES.RolesController).to(RolesController);

container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);

export { container };
