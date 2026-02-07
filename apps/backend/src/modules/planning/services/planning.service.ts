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
import { IssueAssigneeDto } from "../dtos/user.assignee.dto";

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

    async getProjects(serverId: string) {
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

    async getProjectIssues(projectId: string) {
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

        const profiles = await this.userService.getProfilesByIds(assigneeIds);

        const profilesMap = new Map(
            profiles.map(p => {
                const json = p.toJSON();
                return [
            json.id,
            {
                id: json.id,
                username: json.username,
                avatarUrl: json.avatar_url,
            } satisfies IssueAssigneeDto
            ];
            })
        );

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

    async getIssue(issueId: string) {
        const issue = await this.prisma.issue.findUnique({
            where: { id: issueId },
            include: { status: true, subtasks: true, parent: true },
        });
        if (!issue) throw Errors.notFound("Issue not found");
        return issue;
    }

    async updateIssue(dto: IUpdateIssueDto) {
        // если пришёл ТОЛЬКО parentId → это move
        const onlyMove =
            dto.parentId !== undefined &&
            dto.title === undefined &&
            dto.description === undefined &&
            dto.priority === undefined &&
            dto.statusId === undefined &&
            dto.dueDate === undefined;

        if (onlyMove) {
            return this.moveIssue(dto.issueId, dto.parentId);
        }

        // обычное обновление
        return this.updateIssueFields(dto);
    }

    async deleteIssue(issueId: string) {
        await this.prisma.$transaction(async (tx) => {
            await tx.project_issues.deleteMany({ where: { issue_id: issueId } });
            await tx.chat_issues.deleteMany({ where: { issue_id: issueId } });
            await tx.issue_assignee.deleteMany({ where: { issue_id: issueId } });
            await tx.issue.delete({ where: { id: issueId } });
        });
    }

    private normalizeParentId(
        parentId: unknown
        ): string | null | undefined {
        if (parentId === undefined) return undefined;
        if (parentId === null) return null;
        if (parentId === "null") return null;
        if (parentId === "undefined") return null;
        return parentId as string;
        }
    
        private isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}


    private async moveIssue(issueId: string, rawParentId: unknown) {
  const parentId = this.normalizeParentId(rawParentId);

  if (parentId === issueId) {
    throw Errors.conflict("Issue cannot be parent of itself");
  }

  if (parentId && await this.isDescendant(issueId, parentId)) {
    throw Errors.conflict("Cannot move issue under its descendant");
  }

  return this.prisma.issue.update({
    where: { id: issueId },
    data: { parent_id: parentId },
  });
}


    private async isDescendant(
        issueId: string,
        targetParentId: string
        ): Promise<boolean> {
        let current: string | null = targetParentId;

        while (current) {
            // 🔐 защита от мусора
            if (!this.isUuid(current)) return false;

            if (current === issueId) return true;

            const parent: { parent_id: string | null } | null =
            await this.prisma.issue.findUnique({
                where: { id: current },
                select: { parent_id: true },
            });


            current = parent?.parent_id ?? null;
        }

        return false;
        }



    private async updateIssueFields(dto: IUpdateIssueDto) {
        const data: any = {};

        if (dto.title !== undefined) data.title = dto.title;
        if (dto.description !== undefined) data.description = dto.description;
        if (dto.priority !== undefined) data.priority = dto.priority;
        if (dto.statusId !== undefined) data.status_id = dto.statusId;
        if (dto.dueDate !== undefined) data.due_date = dto.dueDate;
        if (dto.parentId !== undefined) data.parent_id = dto.parentId;

        return this.prisma.issue.update({
            where: { id: dto.issueId },
            data,
        });
    }


    async assignUserToIssue(issueId: string, userId: string) {
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

    async unassignUserFromIssue(issueId: string, userId: string) {
        const exists = await this.prisma.issue_assignee.findUnique({
            where: { issue_id_user_id: { issue_id: issueId, user_id: userId } },
        });
        if (!exists) throw Errors.notFound("User not assigned");
        await this.prisma.issue_assignee.delete({
            where: { issue_id_user_id: { issue_id: issueId, user_id: userId } },
        });
    }

    async addChatToIssue(issueId: string, name: string) {
        const chat = await this.chatService.createIssueChat(name);

        return await this.prisma.chat_issues.create({
            data: {
                chat_id: chat.id,
                issue_id: issueId,
            },
        });
    }

    async deleteChatFromIssue(issueId: string, chatId: string) {
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

    async editChatFromIssue(issueId: string, chatId: string, name: string) {
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

    async getIssueChats(issueId: string) {
        const links = await this.prisma.chat_issues.findMany({
            where: { issue_id: issueId },
        });

        return this.chatService.getChatsByIds(links.map((l) => l.chat_id));
    }

    async getIssueStatuses() {
        return await this.prisma.issue_status.findMany();
    }
}
