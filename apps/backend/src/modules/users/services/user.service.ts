import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { PrismaClient } from "@prisma/client";
import { Errors } from "@/common/errors";
import { UserProfile } from "../entity/user.profile";
import { UserUpdate } from "../entity/user.update";
import { ChatService } from "@/modules/chat";
import { UserUpdateDto } from "../dtos/user.update.dto";

@injectable()
export class UserService {
    constructor(
        @inject(TYPES.Prisma) private prisma: PrismaClient,
        @inject(TYPES.ChatService) private chatService: ChatService
    ) {}

    async getProfileById(id: string) {
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

    async getProfilesByIds(ids: string[]) {
        if (ids.length === 0) return [];

        const uniqueIds = Array.from(new Set(ids));

        const users = await this.prisma.users.findMany({
            where: {
                id: { in: uniqueIds },
            },
            include: {
                user_profile: true,
                user_preferences: true,
                blocks_initiated: true,
                blocks_received: true,
            },
        });

        if (users.length !== uniqueIds.length) {
            throw Errors.notFound("One or more users not found");
        }

        return users.map(user => new UserProfile(user));
    }


    async getUsernameById(id: string) {
        const user = await this.prisma.users.findUnique({
            where: { id },
        });

        if (!user) throw Errors.notFound("User not found");

        return { id: user.id };
    }

    async getUserChats(userId: string) {
        const chatAggregate = await this.chatService.getUsersChat(userId);
        const chatList = chatAggregate.toUserChatList();

        if (chatList.length === 0) return [];

        const participantIds = Array.from(
            new Set(chatList.flatMap(chat => chat.participantIds))
        );

        const profiles = await this.getProfilesByIds(participantIds);

        const profileMap = new Map(
            profiles.map(p => {
                const json = p.toJSON();
                return [json.id, json];
            })
        );

        return chatList.map(chat => {
            const members = chat.participantIds
                .map(id => profileMap.get(id))
                .filter((m): m is NonNullable<typeof m> => m !== undefined);

            const otherUser = members.find(m => m.id !== userId);

            return {
                id: chat.id,
                name: chat.name,
                created_at: chat.createdAt,
                members,
                avatar_url: otherUser?.avatar_url ?? null,
            };
        });
    }

    async updateUser(dto: Partial<UserUpdateDto>) {
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

    async searchUser(name: string) {
        const users = await this.prisma.users.findMany({
            where: name ? { username: { contains: String(name), mode: "insensitive" } } : {},
        });

        return users.map(u => ({
            id: u.id,
            username: u.username,
        }));
    }

    async deleteUser(id: string) {
        await this.prisma.users.delete({ where: { id } });

        return { message: "Success delete" };
    }
}
