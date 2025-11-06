import { z } from "zod";
import { IssuePriority } from "@prisma/client";

export const GetIssuesProjectSchema = z.object({
    projectId: z.number().int(),
});

export const GetIssueSchema = z.object({
    issueId: z.number().int().positive("IssueID is required"),
});

export const DeleteIssueSchema = z.object({
    issueId: z.number().int().positive("IssueID is required"),
});

export const CreateIssueSchema = z.object({
    projectId: z.number().int().positive("ProjectID is required"),

    title: z.string().min(1).max(200),
    description: z.string().optional(),

    priority: z.nativeEnum(IssuePriority).default("MEDIUM"),
    statusId: z.number().int(),

    dueDate: z
        .string()
        .datetime()
        .or(z.date())
        .optional(),
    assignees: z.array(z.number().int()).default([]),

    parentId: z.number().int().nullable().optional(),
});


export const UpdateIssueSchema = z.object({
    issueId: z.number().int().positive("IssueID is required"),

    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),

    priority: z.nativeEnum(IssuePriority).optional(),
    statusId: z.number().int().optional(),

    dueDate: z.string().datetime().or(z.date()).optional(),

    parentId: z.number().int().nullable().optional(),
});

export type IGetIssueProjectsDto = z.infer<typeof GetIssuesProjectSchema>;
export type IGetIssueDto = z.infer<typeof GetIssueSchema>;
export type IDeleteIssueDto = z.infer<typeof DeleteIssueSchema>;
export type ICreateIssueDto = z.infer<typeof CreateIssueSchema>;
export type IUpdateIssueDto = z.infer<typeof UpdateIssueSchema>;