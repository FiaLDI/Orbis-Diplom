import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import { IssuePriority } from "@prisma/client";
import { PlanningService } from "../services/planning.service";

@injectable()
export class PlanningController {
    constructor(@inject(TYPES.PlanningService) private planningService: PlanningService) {}

    /* =======================
       PROJECTS
    ======================= */

    getProjects = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const serverId = Number(req.params.serverId);
            const data = await this.planningService.getProjects(serverId);
            return res.json({ message: "Project list", data });
        } catch (err) {
            next(err);
        }
    };

    createProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const serverId = Number(req.params.serverId);
            const { name, description } = req.body;
            const data = await this.planningService.createProject(serverId, name, description);
            return res.json({ message: "Project created", data });
        } catch (err) {
            next(err);
        }
    };

    updateProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const serverId = Number(req.params.serverId);
            const projectId = Number(req.params.projectId);
            const { name, description } = req.body;
            const data = await this.planningService.updateProject(
                serverId,
                projectId,
                name,
                description
            );
            return res.json({ message: "Project updated", data });
        } catch (err) {
            next(err);
        }
    };

    deleteProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const serverId = Number(req.params.serverId);
            const projectId = Number(req.params.projectId);
            await this.planningService.deleteProject(serverId, projectId);
            return res.json({ message: "Project deleted" });
        } catch (err) {
            next(err);
        }
    };

    /* =======================
       ISSUES
    ======================= */

    getProjectIssues = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId = Number(req.params.projectId);
            const data = await this.planningService.getProjectIssues(projectId);
            return res.json({ message: "Project issues", data });
        } catch (err) {
            next(err);
        }
    };

    createIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId = Number(req.params.projectId);
            const data = await this.planningService.createIssue(projectId, req.body);
            return res.json({ message: "Issue created", data });
        } catch (err) {
            next(err);
        }
    };

    getIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const issueId = Number(req.params.issueId);
            const data = await this.planningService.getIssue(issueId);
            return res.json({ message: "Issue info", data });
        } catch (err) {
            next(err);
        }
    };

    updateIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const issueId = Number(req.params.issueId);
            const data = await this.planningService.updateIssue(issueId, req.body);
            return res.json({ message: "Issue updated", data });
        } catch (err) {
            next(err);
        }
    };

    deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const issueId = Number(req.params.issueId);
            await this.planningService.deleteIssue(issueId);
            return res.json({ message: "Issue deleted" });
        } catch (err) {
            next(err);
        }
    };

    /* =======================
       ASSIGNEES
    ======================= */

    assignUserToIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const issueId = Number(req.params.issueId);
            const userId = Number(req.params.userId);
            const data = await this.planningService.assignUserToIssue(issueId, userId);
            return res.json({ message: "User assigned", data });
        } catch (err) {
            next(err);
        }
    };

    unassignUserFromIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const issueId = Number(req.params.issueId);
            const userId = Number(req.params.userId);
            await this.planningService.unassignUserFromIssue(issueId, userId);
            return res.json({ message: "User unassigned" });
        } catch (err) {
            next(err);
        }
    };

    /* =======================
       CHATS
    ======================= */

    addChatToIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const issueId = Number(req.params.issueId);
            const data = await this.planningService.addChatToIssue(issueId, req.body.name);
            return res.json({ message: "Chat added", data });
        } catch (err) {
            next(err);
        }
    };

    getIssueChats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const issueId = Number(req.params.issueId);
            const data = await this.planningService.getIssueChats(issueId);
            return res.json({ message: "Issue chats", data });
        } catch (err) {
            next(err);
        }
    };

    /* =======================
       STATUSES & PRIORITIES
    ======================= */

    getIssueStatuses = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.planningService.getIssueStatuses();
            return res.json({ message: "Statuses list", data });
        } catch (err) {
            next(err);
        }
    };

    getIssuePriorities = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json({ message: "Priority list", data: Object.values(IssuePriority) });
        } catch (err) {
            next(err);
        }
    };
}
