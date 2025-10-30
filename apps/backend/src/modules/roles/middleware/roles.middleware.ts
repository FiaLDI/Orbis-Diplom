import { Request, Response, NextFunction } from "express";
import { prisma } from "@/config";
import jwt from "jsonwebtoken";

type PermissionCheck = string | string[];

export const checkPermission = (
    permissions: PermissionCheck,
    mode: "any" | "all" = "any" // default: достаточно одного совпадения
) => {
    return async (req: any, res: Response, next: NextFunction) => {
        try {
            const token = req.headers["authorization"]?.split(" ")[1];
            if (!token) return res.status(401).json({ message: "Unauthorized" });

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: number };
            if (!decoded) return res.status(401).json({ message: "Invalid token" });

            const userId = decoded.id;
            const serverId = parseInt(req.params.id, 10);

            if (!serverId) {
                return res.status(400).json({ message: "Server ID is required" });
            }

            // получаем все роли пользователя на сервере
            const userServer = await prisma.user_server.findUnique({
                where: {
                    user_id_server_id: { user_id: userId, server_id: serverId },
                },
                include: {
                    roles: {
                        include: {
                            role: {
                                include: {
                                    role_permission: {
                                        include: { permission: true },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!userServer || userServer.roles.length === 0) {
                return res.status(403).json({ message: "No roles assigned" });
            }

            // собираем все permissions юзера
            const userPermissions = new Set(
                userServer.roles.flatMap((ur) =>
                    ur.role.role_permission.map((rp) => rp.permission.name)
                )
            );

            const required = Array.isArray(permissions) ? permissions : [permissions];

            let hasPermission = false;

            if (mode === "any") {
                // достаточно хотя бы одного
                hasPermission = required.some((perm) => userPermissions.has(perm));
            } else {
                // нужны все права
                hasPermission = required.every((perm) => userPermissions.has(perm));
            }

            if (!hasPermission) {
                return res.status(403).json({ message: "Forbidden: no permission" });
            }

            req.user = { id: userId };
            next();
        } catch (err) {
            console.error("checkPermission error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
};
