import { Router } from "express";
import { assignRoleToMember, createServerRole, deleteServerRole, getServerRoles, removeRoleFromMember, updateServerRole } from "../controllers/roles.controller";

export const rolesRouter = Router();

rolesRouter.get("/:id/roles", getServerRoles);
rolesRouter.post("/:id/roles", createServerRole);
rolesRouter.patch("/:id/roles/:roleId", updateServerRole);
rolesRouter.delete("/:id/roles/:roleId", deleteServerRole);
rolesRouter.post("/:id/members/:userId/role/:roleId", assignRoleToMember);
rolesRouter.delete("/:id/members/:userId/role/:roleId", removeRoleFromMember);
