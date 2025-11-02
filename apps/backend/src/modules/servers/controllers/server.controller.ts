import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import { ServerService } from "../services/server.service";
import { UserServersSchema } from "../dtos/user.servers.dto";
import { ServerCreateSchema } from "../dtos/server.create.dto";
import { ServerJoinSchema } from "../dtos/server.join.dto";
import { Errors } from "@/common/errors";
import { ServerInfoSchema } from "../dtos/server.info.dto";

@injectable()
export class ServerController {
    constructor(@inject(TYPES.ServerService) private serverService: ServerService) {}

    getUserServers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = UserServersSchema.parse((req as any).user);
            const entity = await this.serverService.getUserServers(dto.id);

            return res.json({
                message: "Server list",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    createServerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerCreateSchema.parse({
                ...(req as any).user,
                serverId: parseInt(req.params.id),
            });
            const entity = await this.serverService.createServerUser(dto.id, dto.name);

            return res.json({
                message: "Create server",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    joinServerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerJoinSchema.parse({
                ...(req as any).user,
                serverId: parseInt(req.params.id),
            });

            const check = await this.serverService.check(dto.serverId, dto.id);

            if (check) {
                return Errors.conflict("User already joined this server");
            }

            const entity = await this.serverService.joinServerUser(dto);

            return res.json({
                message: "Join server",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    getServerInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerInfoSchema.parse({
                ...(req as any).user,
                serverId: parseInt(req.params.id),
            });

            const check = await this.serverService.check(dto.serverId, dto.id);

            if (!check) {
                return Errors.conflict("User not joined this server");
            }

            const entity = await this.serverService.getServerInfo(dto);

            return res.json({
                message: "Join server",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };
}
