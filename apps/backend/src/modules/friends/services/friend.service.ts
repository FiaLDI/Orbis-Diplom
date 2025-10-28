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
import { sendNotification } from "@/utils/sendNotification";

@injectable()
export class FriendService {
  constructor(
    @inject(TYPES.Prisma) private prisma: PrismaClient,
    @inject(TYPES.UserService) private userService: UserService
  ) {}

  async getUserFriends(id: number) {
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

    if (!friends) throw Errors.notFound("No friends")

    const fullProfiles = await Promise.all(
      friends.map((f) => this.userService.getProfileById(f.id))
    );

    const entity = new UserFriend({ friends: fullProfiles });
    return entity;
  }

  async getFriendRequests(id: number, direction: "incoming" | "outcoming") {
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

  async getFriendStatus(id: number, toUserId: number) {
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

  async friendInvite(id: number, toUserId: number) {
    const existing = await this.prisma.friend_requests.findFirst({
      where: {
        OR: [
          { from_user_id: id, to_user_id: toUserId },
          { from_user_id: toUserId, to_user_id: id },
        ],
      },
    });

    if (existing) {
      throw Errors.conflict("Request already exists")
    }

    await this.prisma.friend_requests.create({
      data: {
        from_user_id: id,
        to_user_id: toUserId,
        status: "pending",
      },
    });

    const username = this.userService.getUsernameById(toUserId)
    
    await sendNotification(toUserId, {
      type: "friend_request",
      title: "Friend Request",
      body: `${username} sent you a friend request`,
      data: { from_user_id: id },
    });
    
    return { message: "Success" };
  }
  
  async friendConfirm(id: number, toUserId: number) {
    const existing = await this.prisma.friend_requests.findFirst({
      where: {
        from_user_id: id,
        to_user_id: toUserId,
        status: "pending",
      },
    });

    if (existing) {
      throw Errors.notFound("Friend request not found or already processed")
    }

    await this.prisma.friend_requests.updateMany({
      where: {
        from_user_id: id,
        to_user_id: toUserId,
      },
      data: {
        status: "accepted",
      },
    });

    const username = this.userService.getUsernameById(id)
    
    await sendNotification(toUserId, {
      type: "friend_accept",
      title: "Friend Request Accepted",
      body: `${username} accepted your friend request`,
      data: { from_user_id: id },
    });
    
    return { message: "Success" };
  }

  async friendReject(id: number, toUserId: number) {
    const existing = await this.prisma.friend_requests.findFirst({
      where: {
        from_user_id: id,
        to_user_id: toUserId,
        status: "pending",
      },
    });

    if (existing) {
      throw Errors.notFound("Friend request not found or already processed")
    }

    await this.prisma.friend_requests.deleteMany({
      where: {
        from_user_id: id,
        to_user_id: toUserId,
        status: "pending",
      },
    });

    const username = this.userService.getUsernameById(id)
    
    await sendNotification(toUserId, {
      type: "friend_reject",
      title: "Friend Request Rejected",
      body: `${username} reject your friend request`,
      data: { from_user_id: id },
    });
    
    return { message: "Success" };
  }

  async friendDelete(id: number, toUserId: number) {
    const existing = await this.prisma.friend_requests.findFirst({
      where: {
        from_user_id: id,
        to_user_id: toUserId,
        status: "accepted",
      },
    });

    if (existing) {
      throw Errors.notFound("Friend request not found or already processed")
    }

     await this.prisma.friend_requests.deleteMany({
        where: {
            OR: [
                { from_user_id: id, to_user_id: toUserId, status: "accepted" },
                { from_user_id: toUserId, to_user_id: id, status: "accepted" },
            ],
        },
    });

    const username = this.userService.getUsernameById(id)
    
    await sendNotification(toUserId, {
      type: "friend_remove",
      title: "Friend remove you",
      body: `${username} remove you at friends`,
      data: { from_user_id: id },
    });
    
    return { message: "Success" };
  }
  
  async blockUser(blockerId: number, blockedUserId: number) {
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

  async unBlockUser(blockerId: number, blockedUserId: number) {
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

  async getBlockedUsers(blockerId: number) {
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
