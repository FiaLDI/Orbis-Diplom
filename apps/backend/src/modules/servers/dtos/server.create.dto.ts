import { z } from "zod";

export const ServerCreateSchema = z.object({
    id: z.number().min(1, "UserID is required"),
    name: z.string().min(1, "Name server is required"),
});

export type ServerCreateDto = z.infer<typeof ServerCreateSchema>;
