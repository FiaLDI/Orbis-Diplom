import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { PrismaClient } from "@prisma/client";
import type { RedisClientType } from "redis";

import { Errors } from "@/common/errors";
import { UserProfile } from "../entity/user.profile";
import { GetUserChatsDto } from "../dtos/user.chats.dto";
import { UserUpdate } from "../entity/user.update";
import { ChatService } from "@/modules/chat";

@injectable()
export class UserService {
    constructor(
        @inject(TYPES.Prisma) private prisma: PrismaClient,
        @inject(TYPES.ChatService) private chatService: ChatService
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

    async getUserChats(id: number) {
        const chats = await this.chatService.getUsersChat(id);

        const chatsWithProfiles = await Promise.all(
            chats.toJSONU().map(async (chat) => {
                const members = await Promise.all(
                    chat.chatUsers.map(async (cu) => {
                        const profile = await this.getProfileById(cu.user_id);
                        return profile.toJSON();
                    })
                );

                return {
                    id: chat.id,
                    title: chat.name,
                    created_at: chat.createdAt,
                    members,
                };
            })
        );

        return chatsWithProfiles;
    }

    async updateUser(dto: Partial<GetUserChatsDto>) {
        const {
            id,
            email,
            username,
            number,
            first_name,
            last_name,
            birth_date,
            avatar_url,
            gender,
            location,
            about,
        } = dto;

        const clean = <T extends Record<string, any>>(obj: T) =>
            Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

        const updated = await this.prisma.users.update({
            where: { id },
            data: clean({
                email,
                username,
                number,
                user_profile: {
                    upsert: {
                        update: clean({
                            first_name,
                            last_name,
                            birth_date: birth_date ? new Date(birth_date) : undefined,
                            avatar_url,
                            gender,
                            location,
                            about,
                        }),
                        create: clean({
                            first_name,
                            last_name,
                            birth_date: birth_date ? new Date(birth_date) : undefined,
                            avatar_url,
                            gender,
                            location,
                            about,
                        }),
                    },
                },
            }),
            include: { user_profile: true },
        });

        const entity = new UserUpdate(updated);

        return entity;
    }

    async searchUser(id: number, name: string) {
        const users = await this.prisma.users.findMany({
            where: name ? { username: { contains: String(name), mode: "insensitive" } } : {},
        });

        return users;
    }

    async deleteUser(id: number) {
        await this.prisma.users.delete({ where: { id } });

        return { message: "Success delete" };
    }
}
