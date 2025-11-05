import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { PrismaClient } from "@prisma/client";
import { Errors } from "@/common/errors";
import { NotificationService } from "@/modules/notifications";

@injectable()
export class PlanningService {
    constructor(
        @inject(TYPES.Prisma) private prisma: PrismaClient,
        @inject(TYPES.NotificationService) private notificationService: NotificationService
    ) {}

    /* =======================
       PROJECTS
    ======================= */

    async getProjects(serverId: number) {
        return await this.prisma.project.findMany({
            where: { server_id: serverId },
            include: { project_issues: { include: { issue: true } } },
        });
    }

    async createProject(serverId: number, name: string, description?: string) {
        return await this.prisma.project.create({
            data: { server_id: serverId, name, description },
        });
    }

    async updateProject(serverId: number, projectId: number, name?: string, description?: string) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.server_id !== serverId) throw Errors.notFound("Project not found");
        return await this.prisma.project.update({
            where: { id: projectId },
            data: { name, description },
        });
    }

    async deleteProject(serverId: number, projectId: number) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.server_id !== serverId) throw Errors.notFound("Project not found");
        await this.prisma.project.delete({ where: { id: projectId } });
    }

    /* =======================
       ISSUES
    ======================= */

    async getProjectIssues(projectId: number) {
        const projectIssues = await this.prisma.project_issues.findMany({
            where: { project_id: projectId },
            include: {
                issue: {
                    include: {
                        status: true,
                        assignees: { include: { user: true } },
                        chat_issues: { include: { chat: true } },
                    },
                },
            },
        });

        const allIssues = projectIssues.map((pi) => pi.issue);

        type IssueWithSubs = {
            id: number;
            title: string;
            description?: string | null;
            priority?: string | null;
            status?: any;
            parent_id?: number | null;
            subtasks?: IssueWithSubs[];
            [key: string]: any;
        };

        const buildTree = (issues: IssueWithSubs[], parentId: number | null = null): IssueWithSubs[] => {
            return issues
                .filter((i) => i.parent_id === parentId)
                .map((i) => ({
                    ...i,
                    subtasks: buildTree(issues, i.id),
                }));
        };

        const tree = buildTree(allIssues);

        return tree;
    }


    async createIssue(projectId: number, dto: any) {
        const { title, description, priority, statusId, due_date, parent_id } = dto;
        return await this.prisma.issue.create({
            data: {
                title,
                description,
                priority,
                status_id: statusId,
                due_date,
                parent_id,
                project_issues: { create: { project_id: projectId } },
            },
            include: { status: true },
        });
    }

    async getIssue(issueId: number) {
        const issue = await this.prisma.issue.findUnique({
            where: { id: issueId },
            include: { status: true, subtasks: true, parent: true },
        });
        if (!issue) throw Errors.notFound("Issue not found");
        return issue;
    }

    async updateIssue(issueId: number, dto: any) {
        const { title, description, priority, statusId, due_date } = dto;
        return await this.prisma.issue.update({
            where: { id: issueId },
            data: { title, description, priority, status_id: statusId, due_date },
        });
    }

    async deleteIssue(issueId: number) {
        await this.prisma.$transaction(async (tx) => {
            await tx.project_issues.deleteMany({ where: { issue_id: issueId } });
            await tx.chat_issues.deleteMany({ where: { issue_id: issueId } });
            await tx.issue_assignee.deleteMany({ where: { issue_id: issueId } });
            await tx.issue.delete({ where: { id: issueId } });
        });
    }

    /* =======================
       ASSIGNEES
    ======================= */

    async assignUserToIssue(issueId: number, userId: number) {
        const exists = await this.prisma.issue_assignee.findUnique({
            where: { issue_id_user_id: { issue_id: issueId, user_id: userId } },
        });
        if (exists) throw Errors.conflict("User already assigned");

        const assignee = await this.prisma.issue_assignee.create({
            data: { issue_id: issueId, user_id: userId },
            include: {
                issue: {
                    include: {
                        project_issues: {
                            include: { project: { select: { id: true, name: true, server_id: true } } },
                        },
                    },
                },
            },
        });

        const project = assignee.issue.project_issues[0]?.project;
        if (project) {
            await this.notificationService.sendNotification(userId, {
                type: "system",
                title: "Assigned to issue",
                body: `You have been assigned to issue "${assignee.issue.title}" in project "${project.name}"`,
                data: { issueId, projectId: project.id, serverId: project.server_id },
            });
        }

        return assignee;
    }

    async unassignUserFromIssue(issueId: number, userId: number) {
        const exists = await this.prisma.issue_assignee.findUnique({
            where: { issue_id_user_id: { issue_id: issueId, user_id: userId } },
        });
        if (!exists) throw Errors.notFound("User not assigned");
        await this.prisma.issue_assignee.delete({
            where: { issue_id_user_id: { issue_id: issueId, user_id: userId } },
        });
    }

    /* =======================
       CHATS
    ======================= */

    async addChatToIssue(issueId: number, name: string) {
        const chat = await this.prisma.chats.create({
            data: { name, created_at: new Date() },
        });
        await this.prisma.chat_issues.create({ data: { issue_id: issueId, chat_id: chat.id } });
        return chat;
    }

    async getIssueChats(issueId: number) {
        const chats = await this.prisma.chat_issues.findMany({
            where: { issue_id: issueId },
            include: { chat: true },
        });
        return chats.map((c) => c.chat);
    }

    /* =======================
       STATUSES
    ======================= */

    async getIssueStatuses() {
        return await this.prisma.issue_status.findMany();
    }
}
