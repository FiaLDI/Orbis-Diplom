import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import type { PrismaClient } from "@prisma/client";
import { Errors } from "@/common/errors";

@injectable()
export class RolePermissionMiddleware {
    constructor(@inject(TYPES.Prisma) private prisma: PrismaClient) {}

    /**
     * Проверка наличия конкретного разрешения у пользователя
     * @param requiredPermission — имя права из таблицы permission_type (например, "BAN_USERS")
     */
    check(requiredPermission: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = (req as any).user;
                if (!user) return next(Errors.unauthorized("User not authenticated"));

                const serverId = parseInt(req.params.id);
                if (isNaN(serverId)) return next(Errors.notFound("Invalid server id"));

                const hasPermission = await this.prisma.user_server.findFirst({
                    where: {
                        user_id: user.id,
                        server_id: serverId,
                        roles: {
                            some: {
                                role: {
                                    role_permission: {
                                        some: {
                                            permission: { name: requiredPermission },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });

                if (!hasPermission) {
                    return next(Errors.conflict(`Missing permission: ${requiredPermission}`));
                }

                next();
            } catch (err) {
                next(err);
            }
        };
    }
}
