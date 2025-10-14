import { Router } from "express";
import { 
    assignRoleToMember, 
    createServerRole, 
    deleteServerRole, 
    getAllPermissions, 
    getRolePermissions, 
    getServerRoles, 
    removeRoleFromMember, 
    updateRolePermissions, 
    updateServerRole 
} from "../controllers/roles.controller";

export const rolesRouter = Router();

/**
 * Роли сервера
 */
rolesRouter.get("/:id/roles", getServerRoles);
rolesRouter.post("/:id/roles", createServerRole);
rolesRouter.patch("/:id/roles/:roleId", updateServerRole);
rolesRouter.delete("/:id/roles/:roleId", deleteServerRole);

/**
 * Назначение / снятие ролей пользователям
 */
rolesRouter.post("/:id/members/:userId/roles/:roleId", assignRoleToMember);
rolesRouter.delete("/:id/members/:userId/roles/:roleId", removeRoleFromMember);

/**
 * Работа с permissions
 */
rolesRouter.get("/roles/permissions", getAllPermissions);
rolesRouter.get("/roles/:roleId/permissions", getRolePermissions);
rolesRouter.patch("/roles/:roleId/permissions", updateRolePermissions);
