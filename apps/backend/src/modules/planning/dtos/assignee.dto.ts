import { z } from "zod";

export const AssignUserToIssueSchema = z.object({
  issueId: z.number().int(),
  userId: z.number().int(),
});

export const UnassignUserFromIssueSchema = z.object({
  issueId: z.number().int(),
  userId: z.number().int(),
});

export type IAssignUserToIssueDto = z.infer<typeof AssignUserToIssueSchema>;
export type IUnassignUserFromIssueDto = z.infer<typeof UnassignUserFromIssueSchema>;