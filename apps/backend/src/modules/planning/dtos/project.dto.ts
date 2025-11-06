import { z } from "zod";

export const GetProjectSchema = z.object({
    serverId: z.number().int().positive("ServerID is required"),
});

export const CreateProjectSchema = z.object({
    serverId: z.number().int().positive("ServerID is required"),
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
});

export const UpdateProjectSchema = z.object({
    serverId: z.number().int().positive("ServerID is required"),
    projectId: z.number().int().positive("ProjectID is required"),
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
});

export const DeleteProjectSchema = z.object({
    serverId: z.number().int(),
    projectId: z.number().int(),
});

export type IGetProjectDto = z.infer<typeof GetProjectSchema>;
export type ICreateProjectDto = z.infer<typeof CreateProjectSchema>;
export type IUpdateProjectDto = z.infer<typeof UpdateProjectSchema>;
export type IDeleteProjectDto = z.infer<typeof DeleteProjectSchema>;
