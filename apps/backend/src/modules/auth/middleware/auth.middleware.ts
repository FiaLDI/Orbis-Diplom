import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@/config";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email?: string | null;
        username?: string | null;
    };
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authorization token missing" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;

        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // подгружаем юзера из базы (чтобы в req.user был актуальный)
        const user = await prisma.users.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, username: true },
        });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // 👈 теперь можно использовать в контроллерах
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
