import { injectable, inject } from "inversify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TYPES } from "@/di/types";
import type { PrismaClient } from "@prisma/client";
import type { RedisClientType } from "redis";

import { UserEntity } from "../entities/auth.entities";
import { TokenEntity } from "../entities/token.entity";
import { CodeEntity } from "../entities/code.entity";
import { Errors } from "@/common/errors";
import { UserService } from "@/modules/users";

@injectable()
export class AuthService {
    constructor(
        @inject(TYPES.Prisma) private prisma: PrismaClient,
        @inject(TYPES.Redis) private redis: RedisClientType,
        @inject(TYPES.UserService) private userService: UserService
    ) {}

    async sendCode(email: string) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const entity = new CodeEntity(email, code, 300);
        await this.redis.setEx(email, entity.ttlSec, entity.code);
        return entity;
    }

    async verifyCode(email: string, code: string) {
        const storedCode = await this.redis.get(email);

        if (!storedCode) throw Errors.domain("Code not found or expired");
        if (storedCode !== code) throw Errors.domain("Invalid verification code");

        await this.redis.del(email);
        return { verified: true };
    }

    async register(data: {
        email: string;
        password: string;
        username: string;
        birth_date: string;
    }) {
        const { email, password, username, birth_date } = data;

        const exists = await this.prisma.users.findFirst({
            where: { OR: [{ email }, { username }] },
        });
        if (exists) throw Errors.conflict("Email or username already exists");

        const birthDate = new Date(birth_date);

        const userEntity = new UserEntity({ email, username, birth_date: birthDate });
        userEntity.assertValid();

        const hashed = await bcrypt.hash(password, 10);

        const created = await this.prisma.users.create({
            data: {
                email,
                username,
                password_hash: hashed,
                user_profile: {
                    create: { birth_date: birthDate, avatar_url: "/img/icon.png" },
                },
                user_preferences: { create: {} },
            },
            include: { user_profile: true, user_preferences: true },
        });

        return {
            message: "User registered successfully",
            user: { id: created.id },
        };
    }

    async login(email: string, password: string) {
        const user = await this.prisma.users.findUnique({
            where: { email },
            include: { user_profile: true, user_preferences: true },
        });

        if (!user) throw Errors.notFound("User not found");

        const isPasswordValid = await bcrypt.compare(password, user.password_hash ?? "");
        if (!isPasswordValid) throw Errors.unauthorized("Invalid credentials");

        const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: "15m",
        });
        const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: "7d",
        });

        const tokenEntity = new TokenEntity({
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: 15 * 60,
        });

        const user_profile = await this.userService.getProfileById(user.id)

        return { token: tokenEntity, user: user_profile };
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) throw Errors.unauthorized("Refresh token missing");

        let decoded: any;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as jwt.JwtPayload;
        } catch {
            throw Errors.unauthorized("Invalid refresh token");
        }

        const dbUser = await this.prisma.users.findUnique({
            where: { id: decoded.id },
            include: { user_profile: true },
        });

        if (!dbUser) throw Errors.notFound("User not found");

        const newAccess = jwt.sign({ id: dbUser.id }, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: "15m",
        });

        const tokenEntity = new TokenEntity({
            access_token: newAccess,
            refresh_token: refreshToken,
            expires_in: 15 * 60,
        });
        
        const user_profile = await this.userService.getProfileById(decoded.id)

        return { token: tokenEntity, user: user_profile };
    }
}
