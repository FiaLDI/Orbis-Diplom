import { RolesController } from "./controllers/roles.controller";
import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { AuthMiddleware } from "@/middleware/auth.middleware";

export const rolesModule = () => {
    const router = express.Router();
    const controller = container.get<RolesController>(TYPES.RolesController);
    const auth = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

    router.get("/:id/roles", auth.handle.bind(auth), controller.getServerRoles.bind(controller) );
    router.post("/:id/roles", auth.handle.bind(auth), controller.createServerRole.bind(controller) );
    router.patch("/:id/roles/:roleId", auth.handle.bind(auth), controller.updateServerRole.bind(controller) );
    router.delete("/:id/roles/:roleId", auth.handle.bind(auth), controller.deleteServerRole.bind(controller) );
    
    router.post("/:id/members/:userId/roles/:roleId", auth.handle.bind(auth), controller.assignRoleToMember.bind(controller) );
    router.delete("/:id/members/:userId/roles/:roleId", auth.handle.bind(auth), controller.unAsignRoleToMember.bind(controller) );
    
    router.get("/roles/permissions", auth.handle.bind(auth), controller.getAllPermissions.bind(controller));
    router.get("/roles/:roleId/permissions", auth.handle.bind(auth), controller.getRolePermissions.bind(controller) );
    router.patch("/roles/:roleId/permissions", auth.handle.bind(auth), controller.updateRolePermissions.bind(controller) );

    return router;
};
