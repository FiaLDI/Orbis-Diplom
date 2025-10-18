import { Router } from "express";
import {
  getProjects,
  createProject,
  getProjectIssues,
  createIssue,
  updateIssue,
  deleteIssue,
  assignUserToIssue,
  unassignUserFromIssue,
  addChatToIssue,
  getIssueChats,
  getIssueStatuses,
  updateProject,
  deleteProject,
  getIssuePriorities,
  getIssue,
} from "../controllers";

export const planningRouter = Router();

// Projects
planningRouter.get("/:id/projects", getProjects);
planningRouter.post("/:id/projects", createProject);
planningRouter.patch("/:id/projects/:projectId", updateProject);
planningRouter.delete("/:id/projects/:projectId", deleteProject);


// Statuses
planningRouter.get("/issues/statuses", getIssueStatuses);
planningRouter.get("/issues/priorities", getIssuePriorities);


// Issues
planningRouter.get("/projects/:id/issues", getProjectIssues);
planningRouter.post("/projects/:id/issues", createIssue);
planningRouter.patch("/issues/:id", updateIssue);
planningRouter.delete("/issues/:id", deleteIssue);
planningRouter.get("/issues/:id", getIssue);

// Assignees
planningRouter.post("/issues/:id/assignees/:userId", assignUserToIssue);
planningRouter.delete("/issues/:id/assignees/:userId", unassignUserFromIssue);

// Chats
planningRouter.post("/issues/:id/chats", addChatToIssue);
planningRouter.get("/issues/:id/chats", getIssueChats);



