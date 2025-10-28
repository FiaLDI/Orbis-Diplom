import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { PrismaClient } from "@prisma/client";
import type { RedisClientType } from "redis";

import { Errors } from "@/common/errors";
import { UserProfile } from "../entity/user.profile";

@injectable()
export class UserService {
    constructor(
        @inject(TYPES.Prisma) private prisma: PrismaClient,
        @inject(TYPES.Redis) private redis: RedisClientType
    ) {}

    async getProfileById(id: number) {
        const user = await this.prisma.users.findUnique({
            where: { id },
            include: {
                user_profile: true,
                user_preferences: true,
                blocks_initiated: true,
                blocks_received: true,
            },
        });

        if (!user) throw Errors.notFound("User not found");
        const entity = new UserProfile(user);

        return entity;
    }

    async getUsernameById(id: number) {
        const user = await this.prisma.users.findUnique({
            where: { id },
        });

        if (!user) throw Errors.notFound("User not found");

        return { id: user.id };
    }
}
