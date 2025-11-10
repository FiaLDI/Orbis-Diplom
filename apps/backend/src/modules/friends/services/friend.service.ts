import { injectable, inject } from "inversify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TYPES } from "@/di/types";
import type { PrismaClient } from "@prisma/client";
import type { RedisClientType } from "redis";

import { UserFriend } from "../entities/user.friend.entities";
import { Errors } from "@/common/errors";
import { RequestsFriends } from "../entities/friend.request.entities";
import { UserService } from "@/modules/users/services/user.service";
import { NotificationService } from "@/modules/notifications";

@injectable()
export class FriendService {
    constructor(
        @inject(TYPES.Prisma) private prisma: PrismaClient,
        @inject(TYPES.UserService) private userService: UserService,
        @inject(TYPES.NotificationService) private notificationService: NotificationService
    ) {}

    async getUserFriends(id: string) {
        const friends = await this.prisma.users.findMany({
            where: {
                OR: [
                    {
                        friend_requests_to: {
                            some: { from_user_id: id, status: "accepted" },
                        },
                    },
                    {
                        friend_requests_from: {
                            some: { to_user_id: id, status: "accepted" },
                        },
                    },
                ],
            },
            select: { id: true },
        });

        if (!friends) throw Errors.notFound("No friends");

        const fullProfiles = await Promise.all(
            friends.map((f) => this.userService.getProfileById(f.id))
        );

        const entity = new UserFriend({ friends: fullProfiles });
        return entity;
    }

    async getFriendRequests(id: string, direction: "incoming" | "outcoming") {
        const entity = new RequestsFriends();

        if (direction === "outcoming") {
            const requests = await this.prisma.friend_requests.findMany({
                where: { from_user_id: id, status: "pending" },
            });

            const fullProfiles = await Promise.all(
                requests.map((f) => this.userService.getProfileById(f.to_user_id))
            );

            entity.setRequest(direction, fullProfiles);
        } else {
            const requests = await this.prisma.friend_requests.findMany({
                where: { to_user_id: id, status: "pending" },
            });

            const fullProfiles = await Promise.all(
                requests.map((f) => this.userService.getProfileById(f.from_user_id))
            );

            entity.setRequest(direction, fullProfiles);
        }

        return entity;
    }

    async getFriendStatus(id: string, toUserId: string) {
        const relation = await this.prisma.friend_requests.findFirst({
            where: {
                OR: [
                    { from_user_id: id, to_user_id: toUserId },
                    { from_user_id: toUserId, to_user_id: id },
                ],
            },
        });

        if (!relation) {
            return { status: "none" };
        }

        return { status: relation.status };
    }

    async friendInvite(id: string, toUserId: string) {
        if (id === toUserId) {
            throw Errors.conflict("You cannot send a friend request to yourself");
        }
        const existing = await this.prisma.friend_requests.findFirst({
            where: {
                OR: [
                    { from_user_id: id, to_user_id: toUserId },
                    { from_user_id: toUserId, to_user_id: id },
                ],
            },
        });
        if (existing) {
            throw Errors.conflict("Friend request already exists");
        }

        const [fromUser, toUser] = await Promise.all([
            this.userService.getUsernameById(id),
            this.userService.getUsernameById(toUserId),
        ]);

        if (!fromUser || !toUser) {
            throw Errors.notFound("User not found");
        }

        await this.prisma.friend_requests.create({
            data: {
                from_user_id: id,
                to_user_id: toUserId,
                status: "pending",
            },
        });

        const senderUsername = await this.userService.getUsernameById(id);

        await this.notificationService.sendNotification(toUserId, {
            type: "friend_request",
            title: "Friend Request",
            body: `${senderUsername} sent you a friend request`,
            data: { from_user_id: id },
        });

        return { message: "Success" };
    }

    async friendConfirm(id: string, toUserId: string) {
        const existing = await this.prisma.friend_requests.findFirst({
            where: {
                from_user_id: toUserId,
                to_user_id: id,
                status: "pending",
            },
        });

        if (!existing) {
            throw Errors.notFound("Friend request not found or already processed");
        }

        await this.prisma.friend_requests.updateMany({
            where: {
                from_user_id: toUserId,
                to_user_id: id,
            },
            data: {
                status: "accepted",
            },
        });

        const username = await this.userService.getUsernameById(id);

        await this.notificationService.sendNotification(toUserId, {
            type: "friend_accept",
            title: "Friend Request Accepted",
            body: `${username} accepted your friend request`,
            data: { from_user_id: id },
        });

        return { message: "Success" };
    }

    async friendReject(id: string, toUserId: string) {
        const existing = await this.prisma.friend_requests.findFirst({
            where: {
                from_user_id: toUserId,
                to_user_id: id,
                status: "pending",
            },
        });

        if (!existing) {
            throw Errors.notFound("Friend request not found or already processed");
        }

        await this.prisma.friend_requests.deleteMany({
            where: {
                from_user_id: toUserId,
                to_user_id: id,
                status: "pending",
            },
        });

        const username = await this.userService.getUsernameById(id);

        await this.notificationService.sendNotification(toUserId, {
            type: "friend_reject",
            title: "Friend Request Rejected",
            body: `${username} reject your friend request`,
            data: { from_user_id: id },
        });

        return { message: "Success" };
    }

    async friendDelete(id: string, toUserId: string) {
        const existing = await this.prisma.friend_requests.findFirst({
            where: {
                OR: [
                    { from_user_id: id, to_user_id: toUserId, status: "accepted" },
                    { from_user_id: toUserId, to_user_id: id, status: "accepted" },
                ],
            },
        });

        if (!existing) {
            throw Errors.notFound("Friend request not found or already processed");
        }

        await this.prisma.friend_requests.deleteMany({
            where: {
                OR: [
                    { from_user_id: id, to_user_id: toUserId, status: "accepted" },
                    { from_user_id: toUserId, to_user_id: id, status: "accepted" },
                ],
            },
        });

        const username = await this.userService.getUsernameById(id);

        await this.notificationService.sendNotification(toUserId, {
            type: "friend_remove",
            title: "Friend remove you",
            body: `${username} remove you at friends`,
            data: { from_user_id: id },
        });

        return { message: "Success" };
    }

    async blockUser(blockerId: string, blockedUserId: string) {
        if (blockerId === blockedUserId) {
            throw Errors.conflict("You cannot block yourself");
        }

        const existing = await this.prisma.users_blocks.findFirst({
            where: { id_users: blockerId, blocked_user_id: blockedUserId },
        });

        if (existing) {
            throw Errors.conflict("User already blocked");
        }

        const defaultReason =
            (await this.prisma.block_reason_type.findFirst({
                where: { name: "Manual Block" },
            })) ||
            (await this.prisma.block_reason_type.create({
                data: { name: "Manual Block" },
            }));

        // Создаём блокировку
        await this.prisma.users_blocks.create({
            data: {
                id_users: blockerId,
                blocked_user_id: blockedUserId,
                reason_type_id: defaultReason.id,
                created_at: new Date(),
                end_at: null,
            },
        });

        return { message: "User successfully blocked" };
    }

    async unBlockUser(blockerId: string, blockedUserId: string) {
        if (blockerId === blockedUserId) {
            throw Errors.conflict("You cannot unblock yourself");
        }

        const existing = await this.prisma.users_blocks.findFirst({
            where: { id_users: blockerId, blocked_user_id: blockedUserId },
        });

        if (!existing) {
            throw Errors.notFound("User is not blocked");
        }

        await this.prisma.users_blocks.delete({
            where: {
                id_users_blocked_user_id: {
                    id_users: blockerId,
                    blocked_user_id: blockedUserId,
                },
            },
        });
        return { message: "User successfully unblocked" };
    }

    async getBlockedUsers(blockerId: string) {
        const user = await this.prisma.users.findUnique({
            where: { id: blockerId },
        });
        if (!user) throw Errors.notFound("User not found");

        const blocks = await this.prisma.users_blocks.findMany({
            where: { id_users: blockerId },
        });

        if (!blocks.length) {
            return [];
        }

        const fullProfiles = await Promise.all(
            blocks.map((b) => this.userService.getProfileById(b.blocked_user_id))
        );

        const blockedUsers = fullProfiles.map((p) => p.toJSON());

        return blockedUsers;
    }
}
