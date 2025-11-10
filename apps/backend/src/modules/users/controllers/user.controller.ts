import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import { UserService } from "../services/user.service";
import { GetUserProfileSchema } from "../dtos/user.profile.dto";
import { GetUserChatsSchema } from "../dtos/user.chats.dto";
import { SearchUserSchema } from "../dtos/user.search.dto";

@injectable()
export class UserController {
    constructor(@inject(TYPES.UserService) private userService: UserService) {}

    getProfileById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = GetUserProfileSchema.parse({ id: req.params.id });
            const entity = await this.userService.getProfileById(dto.id);

            return res.json({
                message: "Profile",
                data: entity.toPublicJSON(),
            });
        } catch (err) {
            next(err);
        }
    };

    getUserChats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = GetUserChatsSchema.parse((req as any).user);
            const entity = await this.userService.getUserChats(dto.id);

            return res.json({
                message: "Chats",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = GetUserChatsSchema.parse({ ...(req as any).user, ...req.body });
            const entity = await this.userService.updateUser(dto);

            return res.json({
                message: "Users",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    searchUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = SearchUserSchema.parse({ ...(req as any).user, name: req.query.name });
            const entity = await this.userService.searchUser(dto.name);

            return res.json({
                message: "Users",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        const dto = GetUserProfileSchema.parse({ id: (req as any).user.id });
    };
}
