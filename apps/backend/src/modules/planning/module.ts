import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { AuthMiddleware } from "@/middleware/auth.middleware";
import { RolePermissionMiddleware } from "@/middleware/role.permission.middleware";
import { PlanningController } from "./controllers/planning.controller";

export const planningModule = () => {
    const router = express.Router();

    const controller = container.get<PlanningController>(TYPES.PlanningController);
    const auth = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
    const rolePerm = container.get<RolePermissionMiddleware>(TYPES.RolePermissionMiddleware);

    /* =======================
       STATUSES & PRIORITIES
    ======================= */

    router.get(
        "/:serverId/issues/statuses",
        auth.handle.bind(auth),
        rolePerm.check("VIEW_ISSUES"),
        controller.getIssueStatuses.bind(controller)
    );

    router.get(
        "/:serverId/issues/priorities",
        auth.handle.bind(auth),
        rolePerm.check("VIEW_ISSUES"),
        controller.getIssuePriorities.bind(controller)
    );

    /* =======================
       PROJECTS
    ======================= */

    router.get(
        "/:serverId/projects",
        auth.handle.bind(auth),
        rolePerm.check("VIEW_PROJECTS"),
        controller.getProjects.bind(controller)
    );

    router.post(
        "/:serverId/projects",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_PROJECT"),
        controller.createProject.bind(controller)
    );

    router.patch(
        "/:serverId/projects/:projectId",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_PROJECT"),
        controller.updateProject.bind(controller)
    );

    router.delete(
        "/:serverId/projects/:projectId",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_PROJECT"),
        controller.deleteProject.bind(controller)
    );

    /* =======================
       ISSUES
    ======================= */

    router.get(
        "/:serverId/projects/:projectId/issues",
        auth.handle.bind(auth),
        rolePerm.check("VIEW_ISSUES"),
        controller.getProjectIssues.bind(controller)
    );

    router.post(
        "/:serverId/projects/:projectId/issues",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_ISSUE"),
        controller.createIssue.bind(controller)
    );

    router.get(
        "/:serverId/issues/:issueId",
        auth.handle.bind(auth),
        rolePerm.check("VIEW_ISSUES"),
        controller.getIssue.bind(controller)
    );

    router.patch(
        "/:serverId/issues/:issueId",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_ISSUE"),
        controller.updateIssue.bind(controller)
    );

    router.delete(
        "/:serverId/issues/:issueId",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_ISSUE"),
        controller.deleteIssue.bind(controller)
    );

    /* =======================
       ASSIGNEES
    ======================= */

    router.post(
        "/:serverId/issues/:issueId/assignees/:userId",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_ASSIGNEES"),
        controller.assignUserToIssue.bind(controller)
    );

    router.delete(
        "/:serverId/issues/:issueId/assignees/:userId",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_ASSIGNEES"),
        controller.unassignUserFromIssue.bind(controller)
    );

    /* =======================
       CHATS
    ======================= */

    router.get(
        "/:serverId/issues/:issueId/chats",
        auth.handle.bind(auth),
        rolePerm.check("VIEW_ISSUES"),
        controller.getIssueChats.bind(controller)
    );

    router.post(
        "/:serverId/issues/:issueId/chats",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_ISSUE"),
        controller.addChatToIssue.bind(controller)
    );

    router.delete(
        "/:serverId/issues/:issueId/chats/:chatId",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_ISSUE"),
        controller.deleteChatFromIssue.bind(controller)
    );

    router.patch(
        "/:serverId/issues/:issueId/chats/:chatId",
        auth.handle.bind(auth),
        rolePerm.check("MANAGE_ISSUE"),
        controller.editChatFromIssue.bind(controller)
    );

    return router;
};
