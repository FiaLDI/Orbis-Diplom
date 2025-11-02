export const TYPES = {
    Prisma: Symbol.for("Prisma"),
    Redis: Symbol.for("Redis"),

    AuthService: Symbol.for("AuthService"),
    AuthController: Symbol.for("AuthController"),

    FriendService: Symbol.for("FriendService"),
    FriendController: Symbol.for("FriendController"),

    UserService: Symbol.for("UserService"),
    UserController: Symbol.for("UserController"),

    NotificationService: Symbol.for("NotificationService"),
    NotificationController: Symbol.for("NotificationController"),

    ChatService: Symbol.for("ChatService"),
    ChatController: Symbol.for("ChatController"),

    MessageService: Symbol.for("MessageService"),
    MessageController: Symbol.for("MessageController"),

    ServerService: Symbol.for("ServerService"),
    ServerController: Symbol.for("ServerController"),

    RolesService: Symbol.for("RolesService"),
    RolesController: Symbol.for("RolesController"),

    AuthMiddleware: Symbol.for("AuthMiddleware"),
};
