import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import { ServerService } from "../services/server.service";
import { UserServersSchema } from "../dtos/user.servers.dto";
import { ServerCreateSchema } from "../dtos/server.create.dto";
import { ServerJoinSchema } from "../dtos/server.join.dto";
import { Errors } from "@/common/errors";
import { ServerInfoSchema } from "../dtos/server.info.dto";
import { ServerUpdateSchema } from "../dtos/server.update.dto";
import { ServerMemberSchema } from "../dtos/server.member.dto";
import { ServerChatIdSchema, ServerIdOnlySchema } from "../dtos/server.chats.dto";
import { ServerCreateLinkSchema, ServerDeleteLinkSchema } from "../dtos/server.link.dto";

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
                ...req.body,
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
                code: req.query.code,
            });

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
                serverId: req.params.id,
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

    updateServer = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerUpdateSchema.parse({
                ...(req as any).user,
                serverId: req.params.id,
                name: req.body?.name,
                avatar_url: req.body?.avatar_url,
            });
            const data = await this.serverService.updateServer(dto);
            return res.json({ message: "Server updated", data });
        } catch (err) {
            next(err);
        }
    };

    deleteServer = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerIdOnlySchema.parse({
                ...(req as any).user,
                serverId: req.params.id,
            });
            const data = await this.serverService.deleteServer(dto);
            return res.json({ message: "Server deleted", data });
        } catch (err) {
            next(err);
        }
    };

    kickMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerMemberSchema.parse({
                ...(req as any).user,
                serverId: req.params.id,
                userId: req.params.userId,
            });
            const data = await this.serverService.kickMember(dto);
            return res.json({ message: "Member kicked", data });
        } catch (err) {
            next(err);
        }
    };

    banMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerMemberSchema.parse({
                ...(req as any).user,
                serverId: req.params.id,
                userId: req.params.userId,
            });
            const data = await this.serverService.banMember(dto);
            return res.json({ message: "Member banned", data });
        } catch (err) {
            next(err);
        }
    };

    unbanMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerMemberSchema.parse({
                ...(req as any).user,
                serverId: req.params.id,
                userId: req.params.userId,
            });
            const data = await this.serverService.unbanMember(dto);
            return res.json({ message: "Member unbanned", data });
        } catch (err) {
            next(err);
        }
    };

    getServerChats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerIdOnlySchema.parse({
                ...(req as any).user,
                serverId: req.params.id,
            });
            const data = await this.serverService.getServerChats(dto);
            return res.json({ message: "Server chats list", data });
        } catch (err) {
            next(err);
        }
    };

    createChat = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerIdOnlySchema.parse({
                ...(req as any).user,
                serverId: req.params.id,
            });
            const data = await this.serverService.createChat(dto);
            return res.json({ message: "Chat created", data });
        } catch (err) {
            next(err);
        }
    };

    getChatInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerChatIdSchema.parse({
                ...(req as any).user,
                serverId: req.params.id,
                chatId: req.params.chatId,
            });
            const data = await this.serverService.getChatInfo(dto);
            return res.json({ message: "Chat info", data });
        } catch (err) {
            next(err);
        }
    };

    deleteChat = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerChatIdSchema.parse({
                ...(req as any).user,
                serverId: req.params.id,
                chatId: req.params.chatId,
            });
            const data = await this.serverService.deleteChat(dto);
            return res.json({ message: "Chat deleted", data });
        } catch (err) {
            next(err);
        }
    };

    getInviteLinks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerCreateLinkSchema.parse({
                ...(req as any).user,
                serverId: req.params.id
            });
            const data = await this.serverService.getInviteLink(dto);
            return res.json({ message: "Invite link lists", data });
        } catch (err) {
            next(err);
        }
    };

    createInviteLink = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerCreateLinkSchema.parse({
                ...(req as any).user,
                serverId: req.params.id
            });
            const data = await this.serverService.createInviteLink(dto);
            return res.json({ message: "Invite link created", data });
        } catch (err) {
            next(err);
        }
    };

    deleteInviteLink = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerDeleteLinkSchema.parse({
                ...(req as any).user,
                serverId: req.params.id,
                code: req.query.code
            });
            const data = await this.serverService.deleteInviteLink(dto);
            return res.json({ message: "Invite link deleted", data });
        } catch (err) {
            next(err);
        }
    };

    getServerMembers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ServerIdOnlySchema.parse({
                ...(req as any).user,
                serverId: req.params.id,
            });
            const data = await this.serverService.getServerMembers(dto);
            return res.json({ message: "Server members", data });
        } catch (err) {
            next(err);
        }
    };
}
