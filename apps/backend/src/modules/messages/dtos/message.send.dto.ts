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

export const MessageSendSchema = z.object({
    id: z.number().int().positive("UserID is required"),
    chatId: z.number().int().positive("ChatID is required"),
    replyToId: z.number().int().optional(),
    content: z.array(MessageContentSchema).min(1, "At least one content item is required"),
});

export type MessageSendDto = z.infer<typeof MessageSendSchema>;
