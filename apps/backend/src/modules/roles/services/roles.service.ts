import { injectable, inject, LazyServiceIdentifier } from "inversify";
import { TYPES } from "@/di/types";
import type { Prisma, PrismaClient } from "@prisma/client";
import { UserService } from "@/modules/users/services/user.service";
import { RolesServer } from "../entities/roles.server.entities";
import { RolesUpdateDto } from "../dtos/roles.update.dto";
import { RolesDeleteDto } from "../dtos/roles.delete.dto";
import { RolesAssignDto } from "../dtos/roles.assign.dto";
import { NotificationService } from "@/modules/notifications";
import { getServer } from "@/modules/servers/helpers/server.helper";
import { Errors } from "@/common/errors";

@injectable()
export class RolesService {
    constructor(
        @inject(TYPES.Prisma) private prisma: PrismaClient,
        @inject(TYPES.UserService) private userService: UserService,
        @inject(TYPES.NotificationService) private notificationService: NotificationService
    ) {}

    async checkRole(roleId: number, serverId: number) {
        const server = await getServer(this.prisma, serverId);

        const role = await this.prisma.role_server.findUnique({
            where: { id: roleId, server_id: serverId },
        });

        return {role, server}
    }

    async getAllPermission() {
        const permissions = await this.prisma.permission_type.findMany({
            select: { id: true, name: true },
            orderBy: { id: "asc" },
        });

        return permissions
    }

    async cleanServerRoles(tx: Prisma.TransactionClient, serverId: number) {
        await tx.user_server_roles.deleteMany({ where: { server_id: serverId } });
        await tx.role_permission.deleteMany({ where: { role: { server_id: serverId } } });
        await tx.role_server.deleteMany({ where: { server_id: serverId } });
    }

    async getServerMembers(serverId: number) {
        const userRoles = await this.prisma.user_server_roles.findMany({
            where: { server_id: serverId },
            select: {
                user_id: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        role_permission: {
                            select: {
                                permission: {
                                    select: { id: true, name: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        const grouped = userRoles.reduce((acc, curr) => {
            if (!acc[curr.user_id]) {
                acc[curr.user_id] = {
                    user_id: curr.user_id,
                    roles: [],
                };
            }

            acc[curr.user_id].roles.push({
                id: curr.role.id,
                name: curr.role.name,
                color: curr.role.color,
                permissions: curr.role.role_permission.map((rp) => ({
                    id: rp.permission.id,
                    name: rp.permission.name,
                })),
            });

            return acc;
        }, {} as Record<number, { user_id: number; roles: any[] }>);

        return Object.values(grouped);
    }

    async getServerRoles(id: number, serverId: number) {
        const roles = await this.prisma.role_server.findMany({
            where: { server_id: serverId },
            include: {
                role_permission: { include: { permission: true } },
                members: {
                    include: {
                        user_server: {
                            select: {
                                user_id: true
                            }
                        }
                    }
                }
            },
        });

        const userIds = [
            ...new Set(
                roles.flatMap(r => r.members.map(m => m.user_server.user_id))
            ),
        ];

        const profiles = await Promise.all(
            userIds.map(id => this.userService.getProfileById(id))
        );

        const entity = new RolesServer(roles, profiles);
        return entity.toJSON();
    }

    async createCreatorServerRole(tx: Prisma.TransactionClient ,serverId: number, userId: number) {
        const creatorRole = await tx.role_server.create({
            data: {
                name: "creator",
                server_id: serverId,
                role_permission: {
                    create: ([]).map((permId: number) => ({
                        permission_id: permId,
                    })),
                },
            },
        });

        await this.assignCreator({tx, userId, serverId, roleId: creatorRole.id})
        await this.assignDefaultRoleUser(tx, userId, serverId, creatorRole.id)

        return { message: "Success" }
    }
    
    async createDefaultServerRole(tx: Prisma.TransactionClient, serverId: number, userId: number) {
        const defaultRole = await tx.role_server.create({
            data: {
                name: "default",
                server_id: serverId,
                role_permission: {
                    create: ([]).map((permId: number) => ({
                        permission_id: permId,
                    })),
                },
            },
        });

        await this.assignDefault({tx, userId, serverId, roleId: defaultRole.id})
        await this.assignDefaultRoleUser(tx, userId, serverId, defaultRole.id);

        return { message: "Success" }
    }


    private async assignCreator({tx, userId, serverId, roleId}: RolesAssignDto & {tx: Prisma.TransactionClient } ) {
        const allPerms = await this.getAllPermission();

        await tx.role_permission.createMany({
            data: allPerms.map((p) => ({
                role_id: roleId,
                permission_id: p.id,
            })),
        });

        return { message: "Success"}
    }

    private async assignDefault({tx, userId, serverId, roleId}: RolesAssignDto & {tx: Prisma.TransactionClient } ) {
        const allPerms = await this.getAllPermission();

        const defaultPerms = [
            "MANAGE_MESSAGES",
            "SEND_MESSAGES",
            "ATTACH_FILES",
            "VIEW_CHANNEL",
        ];
        const allowed = allPerms.filter((p) => defaultPerms.includes(p.name));

        await tx.role_permission.createMany({
            data: allowed.map((p) => ({
                role_id: roleId,
                permission_id: p.id,
            })),
        });

        return { message: "Success"}
    }

    async assignDefaultRoleUser(tx: Prisma.TransactionClient, userId: number, serverId: number, roleId: number | undefined = undefined) {
        let roleIds: number | undefined = roleId
        if (!roleIds) {
            const defaultRole = await tx.role_server.findFirst({
                where: { server_id: serverId, name: "default" },
            });

            roleIds = defaultRole?.id
        }
        
        if (roleIds) {
            await tx.user_server_roles.create({
                data: {
                    user_id: userId,
                    server_id: serverId,
                    role_id: roleIds,
                },
            });
        } else {
            throw Errors.notFound("Default role not founded")
        }

        return { message: "Success" }
    }

    async createCustomServerRole(serverId: number) {
        await this.prisma.role_server.create({
            data: {
                name: "custom",
                server_id: serverId,
                role_permission: {
                    create: ([]).map((permId: number) => ({
                        permission_id: permId,
                    })),
                },
            },
        });

        return { message: "Success" }
    }

    async updateServerRole({ roleId, name, color, permissions }: RolesUpdateDto) {
    return await this.prisma.$transaction(async (tx) => {
        await tx.role_server.update({
        where: { id: roleId },
        data: {
            name,
            color,
        },
        });

        if (permissions && Array.isArray(permissions)) {
        await tx.role_permission.deleteMany({
            where: { role_id: roleId },
        });

        await tx.role_permission.createMany({
            data: permissions.map((p) => ({
            role_id: roleId,
            permission_id: p.id,
            })),
        });
        }

        const updated = await tx.role_server.findUnique({
        where: { id: roleId },
        include: {
            role_permission: {
            include: { permission: true },
            },
        },
        });

        return {
        message: "Role updated successfully",
        data: updated,
        };
    });
    }

    async updateRolePermissions(roleId: number, permissions: number[]) {
        return await this.prisma.$transaction(async (tx) => {
            await tx.role_permission.deleteMany({
            where: { role_id: roleId },
            });

            await tx.role_permission.createMany({
            data: permissions.map((permId) => ({
                role_id: roleId,
                permission_id: permId,
            })),
            });

            return await tx.role_server.findUnique({
            where: { id: roleId },
            include: {
                role_permission: { include: { permission: true } },
            },
            });
        });
        }

    async deleteServerRole({serverId, roleId}: RolesDeleteDto) {
        await this.prisma.$transaction(async (tx) => {
            await tx.user_server_roles.deleteMany({
                where: { role_id: roleId, server_id: serverId },
            });

            await tx.role_permission.deleteMany({
                where: { role_id: roleId },
            });

            await tx.role_server.delete({
                where: { id: roleId },
            });
        });

        return { message: "Role deleted" }
    }

    async assignRoleToMember({userId, serverId, roleId, roleName, serverName}: RolesAssignDto & {roleName?: string, serverName?: string}) {
        await this.prisma.user_server_roles.create({
            data: {
                user_id: userId,
                server_id: serverId,
                role_id: roleId,
            },
        });

        if (roleName && serverName) {
            await this.notificationService.sendNotification(userId, {
                type: "assign_role",
                title: "New Role Assigned",
                body: `You have been assigned the role **${roleName ?? "unknown"}** in server "${serverName ?? "unknown"}".`,
                data: { server_id: serverId, role_id: roleId },
            });
        }
        return { message: "Success" }
    }

    async unAsignRoleToMember({userId, serverId, roleId, roleName, serverName}: RolesAssignDto & {roleName?: string, serverName?: string} ) {
        await this.prisma.user_server_roles.delete({
            where: {
                user_id_server_id_role_id: {
                    user_id: userId,
                    server_id: serverId,
                    role_id: roleId,
                },
            },
        });

        if (roleName && serverName) {
            await this.notificationService.sendNotification(userId, {
                type: "remove_role",
                title: "Role Removed",
                body: `Your role **${roleName ?? "unknown"}** was removed in server "${serverName ?? "unknown"}".`,
                data: { server_id: serverId, role_id: roleId },
            });
        }

        return { message: "Success" }
    }

    async getRolePermissions(roleId: number) {
        const role = await this.prisma.role_server.findUnique({
            where: { id: Number(roleId) },
            include: {
                role_permission: { include: { permission: true } },
            },
        });

        return role?.role_permission.map((rp) => rp.permission) ?? [];
    }
}
