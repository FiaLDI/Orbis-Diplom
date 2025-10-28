import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import { UserService } from "../services/user.service";
import { GetUserProfileSchema } from "../dtos/user.profile.dto";

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService
  ) {}

  getProfileById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = GetUserProfileSchema.parse({ id: Number(req.params.id) });
      const entity = await this.userService.getProfileById(dto.id)

      return res.json({
        message: "Profile",
        data: entity,
      });
    } catch (err) {
      next(err);
    }
  };

}
