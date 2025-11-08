import { z } from "zod";

export const AssignUserToIssueSchema = z.object({
    issueId: z.string().min(1, "IssueId is required"),
    userId: z.string().min(1, "UserId is required"),
});

export const UnassignUserFromIssueSchema = z.object({
    issueId: z.string().min(1, "IssueId is required"),
    userId: z.string().min(1, "UserId is required"),
});

export type IAssignUserToIssueDto = z.infer<typeof AssignUserToIssueSchema>;
export type IUnassignUserFromIssueDto = z.infer<typeof UnassignUserFromIssueSchema>;
