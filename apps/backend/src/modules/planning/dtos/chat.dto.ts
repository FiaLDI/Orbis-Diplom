import { z } from "zod";

export const GetChatToIssueSchema = z.object({
    issueId: z.number().int().positive("IssueID is required"),
});

export const AddChatToIssueSchema = z.object({
    issueId: z.number().int().positive("IssueID is required"),
    name: z.string().min(1, "Chat name is required").max(100),
});

export const DeleteChatToIssueSchema = z.object({
    serverId: z.number().int().positive("ServerID is required"),
    issueId: z.number().int().positive("IssueID is required"),
    chatId: z.number().int().min(1, "ChatID is required"),
});

export const EditChatToIssueSchema = z.object({
    chatId: z.number().int().positive("СhatId is required"),
    issueId: z.number().int().positive("IssueID is required"),
    name: z.string().min(1, "Chat name is required").max(100),
});

export type IAddChatToIssueDto = z.infer<typeof AddChatToIssueSchema>;
export type IDeleteChatToIssueDto = z.infer<typeof DeleteChatToIssueSchema>;
export type IEditChatToIssueDto = z.infer<typeof EditChatToIssueSchema>;
export type IGetChatToIssueDto = z.infer<typeof GetChatToIssueSchema>;
