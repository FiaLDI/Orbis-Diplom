import { z } from "zod";

export const GetProjectSchema = z.object({
    serverId: z.string().min(1, "ServerId is required"),
});

export const CreateProjectSchema = z.object({
    serverId: z.string().min(1, "ServerId is required"),
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
});

export const UpdateProjectSchema = z.object({
    serverId: z.string().min(1, "ServerId is required"),
    projectId: z.string().min(1, "ProjectID is required"),
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
});

export const DeleteProjectSchema = z.object({
    serverId: z.string().min(1, "ServerId is required"),
    projectId: z.string().min(1, "ProjectID is required"),
});

export type IGetProjectDto = z.infer<typeof GetProjectSchema>;
export type ICreateProjectDto = z.infer<typeof CreateProjectSchema>;
export type IUpdateProjectDto = z.infer<typeof UpdateProjectSchema>;
export type IDeleteProjectDto = z.infer<typeof DeleteProjectSchema>;
