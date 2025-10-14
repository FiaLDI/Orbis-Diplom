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
} from "../controllers";

const router = Router();

// Projects
router.get("/servers/:id/projects", getProjects);
router.post("/servers/:id/projects", createProject);

// Issues
router.get("/projects/:id/issues", getProjectIssues);
router.post("/projects/:id/issues", createIssue);
router.patch("/issues/:id", updateIssue);
router.delete("/issues/:id", deleteIssue);

// Assignees
router.post("/issues/:id/assignees/:userId", assignUserToIssue);
router.delete("/issues/:id/assignees/:userId", unassignUserFromIssue);

// Chats
router.post("/issues/:id/chats", addChatToIssue);
router.get("/issues/:id/chats", getIssueChats);

// Statuses
router.get("/issues/statuses", getIssueStatuses);

export default router;
