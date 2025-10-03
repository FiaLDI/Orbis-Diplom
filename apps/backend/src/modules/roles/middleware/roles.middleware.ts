import { Request, Response, NextFunction } from "express";
import { prisma } from "@/config";
import jwt from "jsonwebtoken";

// Проверка прав пользователя на сервере
export const checkPermission = (permission: string) => {
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

      // получаем роль пользователя в сервере
      const userServer = await prisma.user_server.findUnique({
        where: {
          user_id_server_id: { user_id: userId, server_id: serverId },
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

      if (!userServer || !userServer.role) {
        return res.status(403).json({ message: "No role assigned" });
      }

      // проверяем, есть ли нужное право
      const hasPermission = userServer.role.role_permission.some(
        (rp) => rp.permission.name === permission
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden: no permission" });
      }

      req.user = { id: userId }; // прокидываем id юзера дальше
      next();
    } catch (err) {
      console.error("checkPermission error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
