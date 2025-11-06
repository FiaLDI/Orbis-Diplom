import { injectable, inject } from "inversify";
import { TYPES } from "@/di/types";
import type { PrismaClient } from "@prisma/client";
import { Errors } from "@/common/errors";
import { NotificationService } from "@/modules/notifications";
import { ICreateProjectDto, IDeleteProjectDto, IUpdateProjectDto } from "../dtos/project.dto";
import { ICreateIssueDto, IUpdateIssueDto } from "../dtos/issue.dto";
import { IssueListEntity } from "../entities/issue.list.entity";
import { UserProfile } from "@/modules/users/entity/user.profile";
import { UserService } from "@/modules/users";
import { ChatService } from "@/modules/chat";

@injectable()
export class PlanningService {
    constructor(
        @inject(TYPES.Prisma) private prisma: PrismaClient,
        @inject(TYPES.NotificationService) private notificationService: NotificationService,
        @inject(TYPES.UserService) private userService: UserService,
        @inject(TYPES.ChatService) private chatService: ChatService
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

    async createProject({ serverId, name, description }: ICreateProjectDto) {
        return await this.prisma.project.create({
            data: { server_id: serverId, name, description },
        });
    }

    async updateProject({ serverId, projectId, name, description }: IUpdateProjectDto) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.server_id !== serverId) throw Errors.notFound("Project not found");
        return await this.prisma.project.update({
            where: { id: projectId },
            data: { name, description },
        });
    }

    async deleteProject({ serverId, projectId }: IDeleteProjectDto) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.server_id !== serverId) throw Errors.notFound("Project not found");
        await this.prisma.project.delete({ where: { id: projectId } });
    }

    async getProjectIssues(projectId: number) {
        const projectIssues = await this.prisma.project_issues.findMany({
            where: { project_id: projectId },
            include: {
                issue: {
                    include: {
                        status: true,
                        assignees: true,
                        chat_issues: true,
                    },
                },
            },
        });

        const issues = projectIssues.map((pi) => pi.issue);

        const list = new IssueListEntity(issues);

        const assigneeIds = list.getAssigneeUserIds();

        const profiles = assigneeIds.length
            ? await Promise.all(
                  assigneeIds.map((id: number) => this.userService.getProfileById(id))
              )
            : [];

        const profilesMap = new Map(profiles.map((p: any) => [p.toJSON().id, p]));

        const chatIds = list.getChatIds();

        const chats = chatIds.length ? await this.chatService.getChatsByIds(chatIds) : [];

        const chatsMap = new Map(chats.map((c: any) => [c.id, c]));

        return list.toTreeJSON(profilesMap, chatsMap);
    }

    async createIssue({
        projectId,
        title,
        description,
        priority,
        statusId,
        dueDate,
        parentId,
    }: ICreateIssueDto) {
        return await this.prisma.issue.create({
            data: {
                title,
                description,
                priority,
                status_id: statusId,
                due_date: dueDate,
                parent_id: parentId,
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

    async updateIssue({
        issueId,
        title,
        description,
        priority,
        statusId,
        dueDate,
        parentId,
    }: IUpdateIssueDto) {
        return await this.prisma.issue.update({
            where: { id: issueId },
            data: {
                title,
                description,
                priority,
                status_id: statusId,
                due_date: dueDate,
                parent_id: parentId,
            },
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
                            include: {
                                project: { select: { id: true, name: true, server_id: true } },
                            },
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

    async addChatToIssue(issueId: number, name: string) {
        const chat = await this.chatService.createIssueChat(name);

        return await this.prisma.chat_issues.create({
            data: {
                chat_id: chat.id,
                issue_id: issueId,
            },
        });
    }

    async deleteChatFromIssue(issueId: number, chatId: number) {
        const relation = await this.prisma.chat_issues.findUnique({
            where: {
                chat_id_issue_id: {
                    chat_id: chatId,
                    issue_id: issueId,
                },
            },
        });

        if (!relation) {
            throw Errors.notFound("Chat is not attached to this issue");
        }

        await this.prisma.chat_issues.delete({
            where: {
                chat_id_issue_id: {
                    chat_id: chatId,
                    issue_id: issueId,
                },
            },
        });

        const remaining = await this.prisma.chat_issues.findMany({
            where: { chat_id: chatId },
            select: { issue_id: true },
        });

        if (remaining.length === 0) {
            await this.chatService.deleteChat(chatId);
        }

        return { message: "Chat detached from issue" };
    }

    async editChatFromIssue(issueId: number, chatId: number, name: string) {
        const relation = await this.prisma.chat_issues.findUnique({
            where: {
                chat_id_issue_id: {
                    chat_id: chatId,
                    issue_id: issueId,
                },
            },
        });

        if (!relation) {
            throw Errors.notFound("Chat does not belong to this issue");
        }
        const updated = await this.chatService.updateChat(chatId, name);
        return { message: "Chat updated", chat: updated };
    }

    async getIssueChats(issueId: number) {
        const links = await this.prisma.chat_issues.findMany({
            where: { issue_id: issueId },
        });

        return this.chatService.getChatsByIds(links.map((l) => l.chat_id));
    }

    async getIssueStatuses() {
        return await this.prisma.issue_status.findMany();
    }
}
