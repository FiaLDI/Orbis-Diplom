import { z } from "zod";

export const MessageContentSchema = z.object({
    id: z.string().uuid("Invalid content UUID"),
    type: z.enum(["text", "image", "file", "video", "audio"]).default("text"),
    text: z
        .string()
        .trim()
        .transform((val) => (val === "" ? null : val))
        .nullable()
        .optional(),
    url: z
        .string()
        .trim()
        .url()
        .transform((val) => (val === "" ? null : val))
        .nullable()
        .optional(),
});

export type MessageContentDto = z.infer<typeof MessageContentSchema>;