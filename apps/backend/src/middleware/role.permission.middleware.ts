import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import type { PrismaClient } from "@prisma/client";
import { Errors } from "@/common/errors";

@injectable()
export class RolePermissionMiddleware {
  constructor(@inject(TYPES.Prisma) private prisma: PrismaClient) {}

  check(requiredPermission: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = (req as any).user;
        if (!user) return next(Errors.unauthorized("User not authenticated"));

        const serverId =
          parseInt(req.params.serverId) ||
          parseInt(req.params.id) ||
          parseInt(req.body.serverId) ||
          parseInt(req.query.serverId as string);

        if (isNaN(serverId)) {
          console.warn("⚠️ Missing or invalid serverId in request", req.params, req.body, req.query);
          return next(Errors.notFound("Invalid or missing server id"));
        }

        const isCreator = await this.prisma.servers.findFirst({
          where: { id: serverId, creator_id: user.id },
        });
        if (isCreator) {
          console.log(`✅ User ${user.id} is server creator`);
          return next();
        }

        const userRoles = await this.prisma.user_server_roles.findMany({
          where: {
            user_id: user.id,
            server_id: serverId,
          },
          include: {
            role: {
              include: {
                role_permission: {
                  include: { permission: true },
                },
              },
            },
          },
        });

        const allPermissions = userRoles.flatMap((r) =>
          r.role.role_permission.map((rp) => rp.permission.name)
        );

        if (!allPermissions.includes(requiredPermission)) {
          return next(
            Errors.conflict(`Missing permission: ${requiredPermission}`)
          );
        }

        next();
      } catch (err) {
        console.error("❌ RolePermissionMiddleware error:", err);
        next(err);
      }
    };
  }
}
