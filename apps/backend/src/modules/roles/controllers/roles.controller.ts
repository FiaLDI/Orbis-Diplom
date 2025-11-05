import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import { RolesService } from "../services/roles.service";
import { RolesServerSchema } from "../dtos/roles.server.dto";
import { RolesUpdateSchema } from "../dtos/roles.update.dto";
import { Errors } from "@/common/errors";
import { RolesDeleteSchema } from "../dtos/roles.delete.dto";
import { RolesAssignSchema } from "../dtos/roles.assign.dto";
import { RolesPermissionSchema } from "../dtos/role.permission.dto";

@injectable()
export class RolesController {
    constructor(@inject(TYPES.RolesService) private RolesService: RolesService) {}

    getAllPermissions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const entity = await this.RolesService.getAllPermission();

            return res.json({
                message: "Permission list",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    getServerRoles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = RolesServerSchema.parse({
                ...(req as any).user,
                serverId: parseInt(req.params.id, 10)
            });
            const entity = await this.RolesService.getServerRoles(dto.id, dto.serverId);

            return res.json({
                message: "Roles list",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    createServerRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = RolesServerSchema.parse({
                ...(req as any).user,
                serverId: parseInt(req.params.id, 10)
            });
            const entity = await this.RolesService.createCustomServerRole(dto.serverId);

            return res.json({
                message: "Permission list",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    updateServerRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = RolesUpdateSchema.parse({
                ...(req as any).user,
                ...req.body,
                roleId: parseInt(req.params.roleId, 10),
                serverId: parseInt(req.params.id, 10)
            });
            const check = await this.RolesService.checkRole(dto.roleId, dto.serverId);

            if (!check) {
                throw Errors.notFound("Role not found")
            }

            if (check.role?.server_id !== dto.serverId) {
                throw Errors.notFound("Role not found in this server")
            }

            if (
                ["creator", "default"].includes(check.role.name.toLowerCase()) &&
                check.role.name &&
                check.role.name.toLowerCase() !== check.role.name.toLowerCase()
            ) {
                throw Errors.conflict("Cannot rename system role");
            }

            const entity = await this.RolesService.updateServerRole(dto);

            return res.json({
                message: "Permission list",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    deleteServerRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = RolesDeleteSchema.parse({
                ...(req as any).user,
                serverId: parseInt(req.params.id, 10),
                roleId: parseInt(req.params.roleId, 10)
            });

            const check = await this.RolesService.checkRole(dto.roleId, dto.serverId);

            if (!check) {
                throw Errors.notFound("Role not found")
            }

            if (check.role?.server_id !== dto.serverId) {
                throw Errors.notFound("Role not found in this server")
            }

            if (
                ["creator", "default"].includes(check.role.name.toLowerCase()) &&
                check.role.name &&
                check.role.name.toLowerCase() !== check.role.name.toLowerCase()
            ) {
                throw Errors.conflict("Cannot delete system role");
            }
            
            const entity = await this.RolesService.deleteServerRole(dto);

            return res.json({
                message: "Delete role",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    assignRoleToMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = RolesAssignSchema.parse({
                serverId: parseInt(req.params.id, 10),
                roleId: parseInt(req.params.roleId, 10),
                userId: parseInt(req.params.userId, 10),
            });
            
            const check = await this.RolesService.checkRole(dto.roleId, dto.serverId);

            if (!check) {
                throw Errors.notFound("Role not found")
            }

            if (check.role?.server_id !== dto.serverId) {
                throw Errors.notFound("Role not found in this server")
            }
            
            if (check.role.name.toLowerCase() === "creator") {
                throw Errors.domain("Cannot assign creator role manually");
            }

            const entity = await this.RolesService.assignRoleToMember({...dto, roleName: check.role.name, serverName: check.server?.name});

            return res.json({
                message: "Assign role",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    unAsignRoleToMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = RolesAssignSchema.parse({
                serverId: parseInt(req.params.id, 10),
                roleId: parseInt(req.params.roleId, 10),
                userId: parseInt(req.params.userId, 10),
            });

            const check = await this.RolesService.checkRole(dto.roleId, dto.serverId);

            if (!check) {
                throw Errors.notFound("Role not found")
            }

            if (check.role?.server_id !== dto.serverId) {
                throw Errors.notFound("Role not found in this server")
            }
            
            if (check.role.name.toLowerCase() === "creator") {
                throw Errors.domain("Cannot assign creator role manually");
            }

            const entity = await this.RolesService.unAsignRoleToMember({...dto, roleName: check.role.name, serverName: check.server?.name});

            return res.json({
                message: "UnAssign role",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    getRolePermissions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = RolesPermissionSchema.parse({
                ...(req as any).user,
                roleId: parseInt(req.params.roleId, 10),
            });

            const entity = await this.RolesService.getRolePermissions(dto.roleId);

            if (!entity) return res.status(404).json({ message: "Role not found" });

            return res.json({
                message: "Permission list",
                data: entity,
            });
        } catch (err) {
            next(err);
        }
    };

    updateRolePermissions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const roleId = parseInt(req.params.roleId, 10);

            const { permissions } = req.body;

            if (!Array.isArray(permissions)) {
            throw Errors.validation("permissions must be an array");
            }

            const updated = await this.RolesService.updateRolePermissions(roleId, permissions);

            return res.json({
            message: "Permissions updated successfully",
            data: updated,
            });
        } catch (err) {
            next(err);
        }
        };

}
