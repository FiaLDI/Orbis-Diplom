import { injectable, inject } from "inversify";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { PrismaClient } from "@prisma/client";
import { TYPES } from "@/di/types";
import { Errors } from "@/common/errors";

/**
 * Расширенный тип запроса с добавленным пользователем
 */
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email?: string | null;
        username?: string | null;
    };
}

/**
 * DI-middleware аутентификации через JWT.
 * Получает Prisma из контейнера и проверяет токен.
 */
@injectable()
export class AuthMiddleware {
    constructor(@inject(TYPES.Prisma) private prisma: PrismaClient) {}

    async handle(req: AuthRequest, _res: Response, next: NextFunction) {
        try {
            const header = req.headers["authorization"];
            if (!header) throw Errors.unauthorized("Authorization header missing");

            const token = header.split(" ")[1];
            if (!token) throw Errors.unauthorized("Authorization token missing");

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;

            if (!decoded || !decoded.id) throw Errors.unauthorized("Invalid or expired token");

            const user = await this.prisma.users.findUnique({
                where: { id: decoded.id },
                select: { id: true, email: true, username: true },
            });

            if (!user) throw Errors.notFound("User not found");

            req.user = user;
            next();
        } catch (err) {
            next(err);
        }
    }
}
