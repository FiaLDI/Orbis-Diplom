import { injectable, inject, named } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import { IssuePriority } from "@prisma/client";
import { PlanningService } from "../services/planning.service";
import { CreateProjectSchema, DeleteProjectSchema, GetProjectSchema, UpdateProjectSchema } from "../dtos/project.dto";
import { CreateIssueSchema, GetIssueSchema, GetIssuesProjectSchema, UpdateIssueSchema } from "../dtos/issue.dto";
import { AssignUserToIssueSchema, UnassignUserFromIssueSchema } from "../dtos/assignee.dto";
import { AddChatToIssueSchema, DeleteChatToIssueSchema, EditChatToIssueSchema, GetChatToIssueSchema } from "../dtos/chat.dto";

@injectable()
export class PlanningController {
    constructor(@inject(TYPES.PlanningService) private planningService: PlanningService) {}

    /* =======================
       PROJECTS
    ======================= */

    getProjects = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = GetProjectSchema.parse({
                serverId: Number(req.params.serverId)
            });
            const data = await this.planningService.getProjects(dto.serverId);
            return res.json({ message: "Project list", data });
        } catch (err) {
            next(err);
        }
    };

    createProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = CreateProjectSchema.parse({
                serverId: Number(req.params.serverId),
                ...req.body,
            });
            const data = await this.planningService.createProject(dto);
            return res.json({ message: "Project created", data });
        } catch (err) {
            next(err);
        }
    };

    updateProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = UpdateProjectSchema.parse({
                serverId: Number(req.params.serverId),
                projectId: Number(req.params.projectId),
                ...req.body,
            });
            const data = await this.planningService.updateProject(dto);
            return res.json({ message: "Project updated", data });
        } catch (err) {
            next(err);
        }
    };

    deleteProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = DeleteProjectSchema.parse({
                serverId: Number(req.params.serverId),
                projectId: Number(req.params.projectId),
                ...req.body,
            });
            await this.planningService.deleteProject(dto);
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
            const dto = GetIssuesProjectSchema.parse({
                projectId: Number(req.params.projectId)
            })
            const data = await this.planningService.getProjectIssues(dto.projectId);
            return res.json({ message: "Project issues", data });
        } catch (err) {
            next(err);
        }
    };

    createIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = CreateIssueSchema.parse({
                projectId: Number(req.params.projectId),
                ...req.body,
            });
            const data = await this.planningService.createIssue(dto);
            return res.json({ message: "Issue created", data });
        } catch (err) {
            next(err);
        }
    };

    getIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = GetIssueSchema.parse({
                issueId: Number(req.params.issueId),
            });
            const data = await this.planningService.getIssue(dto.issueId);
            return res.json({ message: "Issue info", data });
        } catch (err) {
            next(err);
        }
    };

    updateIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = UpdateIssueSchema.parse({
                issueId: Number(req.params.issueId),
                ...req.body,
            });

            const data = await this.planningService.updateIssue(dto);
            return res.json({ message: "Issue updated", data });
        } catch (err) {
            next(err);
        }
    };

    deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = GetIssueSchema.parse({
                issueId: Number(req.params.issueId),
            });
            await this.planningService.deleteIssue(dto.issueId);
            return res.json({ message: "Issue deleted" });
        } catch (err) {
            next(err);
        }
    };

    assignUserToIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = AssignUserToIssueSchema.parse({
                issueId: parseInt(req.params.issueId),
                userId: parseInt(req.params.userId)
            })
            const data = await this.planningService.assignUserToIssue(dto.issueId, dto.userId);
            return res.json({ message: "User assigned", data });
        } catch (err) {
            next(err);
        }
    };

    unassignUserFromIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = UnassignUserFromIssueSchema.parse({
                issueId: parseInt(req.params.issueId),
                userId: parseInt(req.params.userId)
            })
            await this.planningService.unassignUserFromIssue(dto.issueId, dto.userId);
            return res.json({ message: "User unassigned" });
        } catch (err) {
            next(err);
        }
    };

    addChatToIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = AddChatToIssueSchema.parse({
                issueId: parseInt(req.params.issueId),
                name: req.body.name
            })
            const data = await this.planningService.addChatToIssue(dto.issueId, dto.name);
            return res.json({ message: "Chat added", data });
        } catch (err) {
            next(err);
        }
    };

    editChatFromIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = EditChatToIssueSchema.parse({
                chatId: parseInt(req.params.chatId),
                issueId: parseInt(req.params.issueId),
                name: req.body.name
            })
            const data = await this.planningService.editChatFromIssue(dto.issueId, dto.chatId, dto.name);
            return res.json({ message: "Chat added", data });
        } catch (err) {
            next(err);
        }
    };

    deleteChatFromIssue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = DeleteChatToIssueSchema.parse({
                issueId: parseInt(req.params.issueId),
                serverId: parseInt(req.params.serverId),
                chatId: parseInt(req.params.chatId),
            })
            const data = await this.planningService.deleteChatFromIssue(dto.issueId, dto.chatId);
            return res.json({ message: "Chat added", data });
        } catch (err) {
            next(err);
        }
    };

    getIssueChats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = GetChatToIssueSchema.parse({
                issueId: Number(req.params.issueId)
            })
            const data = await this.planningService.getIssueChats(dto.issueId);
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
