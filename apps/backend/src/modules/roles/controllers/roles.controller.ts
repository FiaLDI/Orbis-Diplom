import { Request, Response } from "express";
import { prisma } from "@/config";
import jwt from "jsonwebtoken";

/**
 * GET /servers/:id/roles
 */
export const getServerRoles = async (req: Request, res: Response) => {
  const serverId = parseInt(req.params.id, 10);

  try {
    const roles = await prisma.role_server.findMany({
      where: {
        user_server: {
          some: { server_id: serverId },
        },
      },
      include: {
        role_permission: {
          include: { permission: true },
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
 */
export const createServerRole = async (req: Request, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  const { name, permissions } = req.body;

  try {
    const role = await prisma.role_server.create({
      data: {
        name,
        user_server: {
          create: [], // пока пусто, можно назначать позже
        },
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
 */
export const updateServerRole = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.roleId, 10);
  const { name, permissions } = req.body;

  try {
    const updated = await prisma.role_server.update({
      where: { id: roleId },
      data: {
        name,
        role_permission: permissions
          ? {
              deleteMany: {}, // удалить старые
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
 */
export const deleteServerRole = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.roleId, 10);

  try {
    await prisma.role_server.delete({
      where: { id: roleId },
    });

    res.json({ message: "Role deleted" });
  } catch (err) {
    console.error("Error deleteServerRole:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /servers/:id/members/:userId/role/:roleId
 */
export const assignRoleToMember = async (req: Request, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  const userId = parseInt(req.params.userId, 10);
  const roleId = parseInt(req.params.roleId, 10);

  try {
    await prisma.user_server.update({
      where: {
        user_id_server_id: { user_id: userId, server_id: serverId },
      },
      data: { role_id: roleId },
    });

    res.json({ message: "Role assigned to user" });
  } catch (err) {
    console.error("Error assignRoleToMember:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * DELETE /servers/:id/members/:userId/role/:roleId
 */
export const removeRoleFromMember = async (req: Request, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  const userId = parseInt(req.params.userId, 10);

  try {
    await prisma.user_server.update({
      where: {
        user_id_server_id: { user_id: userId, server_id: serverId },
      },
      data: { role_id: null },
    });

    res.json({ message: "Role removed from user" });
  } catch (err) {
    console.error("Error removeRoleFromMember:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
