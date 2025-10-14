import { Request, Response } from "express";
import { prisma } from "@/config";

/**
 * GET /servers/:id/roles
 * Получить все роли сервера
 */
export const getServerRoles = async (req: Request, res: Response) => {
  const serverId = parseInt(req.params.id, 10);

  try {
    const roles = await prisma.role_server.findMany({
      where: { server_id: serverId },
      include: {
        role_permission: { include: { permission: true } },
        members: {
          include: {
            user_server: {
              include: { user: { include: { user_profile: true } } },
            },
          },
        },
      },
    });

    res.json(roles);
  } catch (err) {
    console.error("Error getServerRoles:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /servers/:id/roles
 * Создать новую роль в сервере
 */
export const createServerRole = async (req: Request, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  const { name, permissions } = req.body;

  try {
    const role = await prisma.role_server.create({
      data: {
        name,
        server_id: serverId,
        role_permission: {
          create: (permissions || []).map((permId: number) => ({
            permission_id: permId,
          })),
        },
      },
    });

    res.status(201).json(role);
  } catch (err) {
    console.error("Error createServerRole:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * PATCH /servers/:id/roles/:roleId
 * Обновить имя/права роли
 */
export const updateServerRole = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.roleId, 10);
  const serverId = parseInt(req.params.id, 10);
  const { name, color, permissions } = req.body;

  try {
    const role = await prisma.role_server.findUnique({
      where: { id: roleId },
    });

    if (!role || role.server_id !== serverId) {
      return res.status(404).json({ message: "Role not found in this server" });
    }

    if (["creator", "default"].includes(role.name.toLowerCase()) && name && name.toLowerCase() !== role.name.toLowerCase()) {
      return res.status(400).json({ message: "Cannot rename system role" });
    }


    if ((role.name === "creator" || role.name === "default") && name && name !== role.name) {
      return res.status(400).json({ message: "Cannot rename system role" });
    }

    const updated = await prisma.role_server.update({
      where: { id: roleId },
      data: {
        // имя обновляем только если не системная
        name: role.name === "creator" || role.name === "default" ? role.name : name,
        color,
        role_permission: permissions
          ? {
              deleteMany: {},
              create: permissions.map((permId: number) => ({
                permission_id: permId,
              })),
            }
          : undefined,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("Error updateServerRole:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * DELETE /servers/:id/roles/:roleId
 * Удалить роль
 */
export const deleteServerRole = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.roleId, 10);
  const serverId = parseInt(req.params.id, 10);

  try {
    const role = await prisma.role_server.findUnique({
      where: { id: roleId },
    });

    if (!role || role.server_id !== serverId) {
      return res.status(404).json({ message: "Role not found in this server" });
    }

    if (["creator", "default"].includes(role.name.toLowerCase())) {
      return res.status(400).json({ message: "Cannot delete system role" });
    }

    await prisma.$transaction(async (tx) => {
      // удаляем связи user ↔ role
      await tx.user_server_roles.deleteMany({
        where: { role_id: roleId, server_id: serverId },
      });

      // удаляем права
      await tx.role_permission.deleteMany({
        where: { role_id: roleId },
      });

      // удаляем саму роль
      await tx.role_server.delete({
        where: { id: roleId },
      });
    });

    res.json({ message: "Role deleted" });
  } catch (err) {
    console.error("Error deleteServerRole:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



/**
 * POST /servers/:id/members/:userId/role/:roleId
 * Выдать роль пользователю
 */
export const assignRoleToMember = async (req: Request, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  const userId = parseInt(req.params.userId, 10);
  const roleId = parseInt(req.params.roleId, 10);

  try {
    const role = await prisma.role_server.findUnique({
      where: { id: roleId },
    });

    if (!role || role.server_id !== serverId) {
      return res.status(404).json({ message: "Role not found in this server" });
    }

    if (role.name.toLowerCase() === "creator") {
      return res.status(400).json({ message: "Cannot assign creator role manually" });
    }

    await prisma.user_server_roles.create({
      data: {
        user_id: userId,
        server_id: serverId,
        role_id: roleId,
      },
    });

    res.json({ message: "Role assigned to user" });
  } catch (err) {
    console.error("Error assignRoleToMember:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * DELETE /servers/:id/members/:userId/role/:roleId
 * Убрать роль у пользователя
 */
export const removeRoleFromMember = async (req: Request, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  const userId = parseInt(req.params.userId, 10);
  const roleId = parseInt(req.params.roleId, 10);

  try {
    await prisma.user_server_roles.delete({
      where: {
        user_id_server_id_role_id: {
          user_id: userId,
          server_id: serverId,
          role_id: roleId,
        },
      },
    });

    res.json({ message: "Role removed from user" });
  } catch (err) {
    console.error("Error removeRoleFromMember:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /roles/permissions
 * Получить список всех возможных прав
 */
export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await prisma.permission_type.findMany({
      select: { id: true, name: true },
      orderBy: { id: "asc" },
    });
    res.json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Failed to fetch permissions" });
  }
};

/**
 * GET /roles/:roleId/permissions
 * Получить права конкретной роли
 */
export const getRolePermissions = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;

    const role = await prisma.role_server.findUnique({
      where: { id: Number(roleId) },
      include: {
        role_permission: { include: { permission: true } },
      },
    });

    if (!role) return res.status(404).json({ message: "Role not found" });

    res.json(role.role_permission.map((rp) => rp.permission));
  } catch (err) {
    console.error("Error getRolePermissions:", err);
    res.status(500).json({ message: "Failed to fetch role permissions" });
  }
};

/**
 * PATCH /roles/:roleId/permissions
 * Обновить permissions роли
 */
export const updateRolePermissions = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;
    const { permissions } = req.body;

    const role = await prisma.role_server.findUnique({ where: { id: Number(roleId) } });
    if (!role) return res.status(404).json({ message: "Role not found" });

    if (role.name.toLowerCase() === "creator") {
      return res.status(400).json({ message: "Cannot update permissions of creator role" });
    }

    await prisma.role_permission.deleteMany({
      where: { role_id: Number(roleId) },
    });

    await prisma.role_permission.createMany({
      data: permissions.map((pid: number) => ({
        role_id: Number(roleId),
        permission_id: pid,
      })),
    });

    res.json({ message: "Role permissions updated" });
  } catch (err) {
    console.error("updateRolePermissions error:", err);
    res.status(500).json({ message: "Failed to update role permissions" });
  }
};
