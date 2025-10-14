import { Request, Response } from "express";
import { prisma } from "@/config";
import { ioPlanning } from "@/server";
import { IssuePriority } from "@prisma/client";

/* =======================
   PROJECTS
   ======================= */

// GET /servers/:id/projects
export const getProjects = async (req: Request, res: Response) => {
  const serverId = Number(req.params.id);
  try {
    const projects = await prisma.project.findMany({
      where: { server_id: serverId },
      include: {
        project_issues: { include: { issue: true } }
      }
    });
    res.json(projects);
  } catch (err) {
    console.error("getProjects error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createProject = async (req: Request, res: Response) => {
  const serverId = Number(req.params.id);
  const { name, description } = req.body;
  try {
    const project = await prisma.project.create({
      data: { server_id: serverId, name, description }
    });
    res.status(201).json(project);
  } catch (err) {
    console.error("createProject error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
/**
 * PATCH /planning/:id/projects/:projectId
 */
export const updateProject = async (req: Request, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const { name, description } = req.body;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.server_id !== serverId) {
      return res.status(404).json({ message: "Project not found in this server" });
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { name, description },
    });

    res.json(updated);
  } catch (err) {
    console.error("updateProject error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * DELETE /planning/:id/projects/:projectId
 */
export const deleteProject = async (req: Request, res: Response) => {
  const serverId = parseInt(req.params.id, 10);
  const projectId = parseInt(req.params.projectId, 10);

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.server_id !== serverId) {
      return res.status(404).json({ message: "Project not found in this server" });
    }

    await prisma.project.delete({ where: { id: projectId } });
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("deleteProject error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =======================
   ISSUES
   ======================= */

// GET /projects/:id/issues
export const getProjectIssues = async (req: Request, res: Response) => {
  const projectId = Number(req.params.id);
  try {
   const issues = await prisma.project_issues.findMany({
  where: { project_id: projectId },
  include: {
    issue: {
      include: {
        status: true,
        assignees: { include: { user: true } },
        chat_issues: { include: { chat: true } },
        subtasks: {
          where: {
            project_issues: { some: { project_id: projectId } },
          },
          include: {
            status: true,
            assignees: { include: { user: true } },
          },
        },
        parent: {
          include: { project_issues: true },
        },
      },
    },
  },
});


    res.json(issues.map(pi => pi.issue));
  } catch (err) {
    console.error("getProjectIssues error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /projects/:id/issues
export const createIssue = async (req: Request, res: Response) => {
  const projectId = Number(req.params.id);
  const { title, description, priority, statusId, due_date, parent_id } = req.body;
  try {
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        priority,
        status_id: statusId,
        due_date,
        parent_id,
        project_issues: {
          create: { project_id: projectId }
        }
      },
      include: { status: true }
    });

    ioPlanning.to(`project:${projectId}`).emit("issue:created", issue);

    res.status(201).json(issue);
  } catch (err) {
    console.error("createIssue error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// PATCH /issues/:id
export const updateIssue = async (req: Request, res: Response) => {
  const issueId = Number(req.params.id);
  const { title, description, priority, statusId, due_date } = req.body;
  try {
    const updated = await prisma.issue.update({
      where: { id: issueId },
      data: { title, description, priority, status_id: statusId, due_date }
    });
    res.json(updated);
  } catch (err) {
    console.error("updateIssue error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /issues/:id
export const deleteIssue = async (req: Request, res: Response) => {
  const issueId = Number(req.params.id);

  try {
    // Сначала удаляем все связи с проектами
    await prisma.project_issues.deleteMany({
      where: { issue_id: issueId },
    });

    // Если есть связи с чатами — тоже удаляем
    await prisma.chat_issues.deleteMany({
      where: { issue_id: issueId },
    });

    // Если есть исполнители — удаляем
    await prisma.issue_assignee.deleteMany({
      where: { issue_id: issueId },
    });

    // Наконец, удаляем сам issue
    await prisma.issue.delete({
      where: { id: issueId },
    });

    res.status(204).send();
  } catch (err) {
    console.error("deleteIssue error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


/* =======================
   ASSIGNEES
   ======================= */

// POST /issues/:id/assignees/:userId
export const assignUserToIssue = async (req: Request, res: Response) => {
  const issueId = Number(req.params.id);
  const userId = Number(req.params.userId);
  try {
    await prisma.issue_assignee.create({
      data: { issue_id: issueId, user_id: userId }
    });
    res.json({ message: "User assigned" });
  } catch (err) {
    console.error("assignUserToIssue error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /issues/:id/assignees/:userId
export const unassignUserFromIssue = async (req: Request, res: Response) => {
  const issueId = Number(req.params.id);
  const userId = Number(req.params.userId);
  try {
    await prisma.issue_assignee.delete({
      where: { issue_id_user_id: { issue_id: issueId, user_id: userId } }
    });
    res.json({ message: "User unassigned" });
  } catch (err) {
    console.error("unassignUserFromIssue error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =======================
   CHATS
   ======================= */

// POST /issues/:id/chats
export const addChatToIssue = async (req: Request, res: Response) => {
  const issueId = Number(req.params.id);
  const { chatName } = req.body;
  try {
    const chat = await prisma.chats.create({
      data: { name: chatName, created_at: new Date() }
    });
    await prisma.chat_issues.create({
      data: { issue_id: issueId, chat_id: chat.id }
    });
    res.status(201).json(chat);
  } catch (err) {
    console.error("addChatToIssue error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /issues/:id/chats
export const getIssueChats = async (req: Request, res: Response) => {
  const issueId = Number(req.params.id);
  try {
    const chats = await prisma.chat_issues.findMany({
      where: { issue_id: issueId },
      include: { chat: true }
    });
    res.json(chats.map(c => c.chat));
  } catch (err) {
    console.error("getIssueChats error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =======================
   STATUSES
   ======================= */

// GET /issues/statuses
export const getIssueStatuses = async (_req: Request, res: Response) => {
  try {
    const statuses = await prisma.issue_status.findMany();
    res.json(statuses);
  } catch (err) {
    console.error("getIssueStatuses error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getIssuePriorities = async (req: Request, res: Response) => {
  try {
    res.json(Object.values(IssuePriority));
  } catch (err) {
    console.error("Error fetching priorities:", err);
    res.status(500).json({ message: "Failed to fetch priorities" });
  }
};