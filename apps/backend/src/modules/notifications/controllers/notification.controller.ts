import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import { NotificationService } from "../services/notification.service";
import { getNotificationSchema } from "../dtos/notification.dto";
import { markNotificationSchema } from "../dtos/markNotification";

@injectable()
export class NotificationController {
    constructor(
        @inject(TYPES.NotificationService) private notificationService: NotificationService
    ) {}

    getNotifications = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = getNotificationSchema.parse({ ...(req as any).user });
        const entity = await this.notificationService.getNotifications(dto.id);

        return res.json({
            message: "Notification",
            data: entity,
        });
      } catch (err) {
        next(err);
      }
    };

    markNotificationRead = async (req: any, res: Response, next: NextFunction) => {
      try {
        const dto = markNotificationSchema.parse({ ...(req as any).user, notificationId: parseInt(req.params.id, 10) });
        const entity = await this.notificationService.markNotificationRead(dto.id, dto.notificationId);

        return res.json({
            message: "Notification",
            data: entity,
        });
      } catch (err) {
        next(err);
      }
    }

    markNotificationDelete = async (req: any, res: Response, next: NextFunction) => {
      try {
        const dto = markNotificationSchema.parse({ ...(req as any).user, notificationId: parseInt(req.params.id, 10) });
        const entity = await this.notificationService.deleteNotification(dto.id, dto.notificationId);

        return res.json({
            message: "Notification",
            data: entity,
        });
      } catch (err) {
        next(err);
      }
    }

    markAllNotificationRead = async (req: any, res: Response, next: NextFunction) => {
      try {
        const dto = getNotificationSchema.parse((req as any).user);
        const entity = await this.notificationService.markAllNotificationRead(dto.id);

        return res.json({
            message: "Notification",
            data: entity,
        });
      } catch (err) {
        next(err);
      }
    }

    markAllNotificationDelete = async (req: any, res: Response, next: NextFunction) => {
      try {
        const dto = getNotificationSchema.parse((req as any).user);
        const entity = await this.notificationService.deleteAllNotification(dto.id);

        return res.json({
            message: "Notification",
            data: entity,
        });
      } catch (err) {
        next(err);
      }
    }
}
