import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import { NotificationService } from "../services/notification.service";

@injectable()
export class NotificationController {
    constructor(
        @inject(TYPES.NotificationService) private notificationService: NotificationService
    ) {}
}
