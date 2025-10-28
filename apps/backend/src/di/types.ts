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

  AuthMiddleware: Symbol.for("AuthMiddleware"),
};
