import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import { FriendService } from "../services/friend.service";
import { UserFriendSchema } from "../dtos/user.friend.dto";
import { FriendRequestsSchema } from "../dtos/friend.request.dto";
import { FriendInviteSchema } from "../dtos/friend.invite.dto";

@injectable()
export class FriendController {
    constructor(@inject(TYPES.FriendService) private friendService: FriendService) {}

    getUserFriends = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = UserFriendSchema.parse((req as any).user);
            const entity = await this.friendService.getUserFriends(dto.id);

            return res.json({
                message: "Friend list",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    getFriendRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = FriendRequestsSchema.parse({
                ...(req as any).user,
                direction: req.query.direction,
            });
            const entity = await this.friendService.getFriendRequests(dto.id, dto.direction);

            return res.json({
                message: "Friend request",
                data: entity,
                extra: {
                    direction: dto.direction,
                },
            });
        } catch (err) {
            next(err);
        }
    };

    getFriendStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = FriendInviteSchema.parse({ ...(req as any).user, toUserId: req.params.id });
            const entity = await this.friendService.getFriendStatus(dto.id, dto.toUserId);

            return res.json({
                message: "Friend status",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    getUserBlocks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = UserFriendSchema.parse((req as any).user);
            const entity = await this.friendService.getBlockedUsers(dto.id);

            return res.json({
                message: "Friend list",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    friendInvite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = FriendInviteSchema.parse({ ...(req as any).user, toUserId: req.params.id });
            console.log(dto)
            const entity = await this.friendService.friendInvite(dto.id, dto.toUserId);

            return res.json({
                message: "Friend invite",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    friendConfirm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = FriendInviteSchema.parse({ ...(req as any).user, toUserId: req.params.id });
            const entity = await this.friendService.friendConfirm(dto.id, dto.toUserId);

            return res.json({
                message: "Friend confirm",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    friendReject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = FriendInviteSchema.parse({ ...(req as any).user, toUserId: req.params.id });
            const entity = await this.friendService.friendReject(dto.id, dto.toUserId);

            return res.json({
                message: "Friend reject",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    friendDelete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = FriendInviteSchema.parse({ ...(req as any).user, toUserId: req.params.id });
            const entity = await this.friendService.friendDelete(dto.id, dto.toUserId);

            return res.json({
                message: "Friend deleted",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    blockUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = FriendInviteSchema.parse({ ...(req as any).user, toUserId: req.params.id });
            const entity = await this.friendService.blockUser(dto.id, dto.toUserId);

            return res.json({
                message: "Friend deleted",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    unBlockUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = FriendInviteSchema.parse({ ...(req as any).user, toUserId: req.params.id });
            const entity = await this.friendService.unBlockUser(dto.id, dto.toUserId);

            return res.json({
                message: "Friend deleted",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };
}
