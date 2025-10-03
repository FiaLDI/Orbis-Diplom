import { Router } from "express";
import { assignRoleToMember, createServerRole, deleteServerRole, getServerRoles, removeRoleFromMember, updateServerRole } from "../controllers/roles.controller";

export const rolesRouter = Router();

rolesRouter.get("/servers/:id/roles", getServerRoles);
rolesRouter.post("/servers/:id/roles", createServerRole);
rolesRouter.patch("/servers/:id/roles/:roleId", updateServerRole);
rolesRouter.delete("/servers/:id/roles/:roleId", deleteServerRole);
rolesRouter.post("/servers/:id/members/:userId/role/:roleId", assignRoleToMember);
rolesRouter.delete("/servers/:id/members/:userId/role/:roleId", removeRoleFromMember);
