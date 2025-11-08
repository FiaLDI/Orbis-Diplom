import { z } from "zod";

export const GetChatToIssueSchema = z.object({
    issueId: z.string().min(1, "IssueID is required"),
});

export const AddChatToIssueSchema = z.object({
    issueId: z.string().min(1, "IssueID is required"),
    name: z.string().min(1, "Chat name is required").max(100),
});

export const DeleteChatToIssueSchema = z.object({
    serverId: z.string().min(1, "ServerId is required"),
    issueId: z.string().min(1, "IssueID is required"),
    chatId: z.string().min(1, "ChatId is required"),
});

export const EditChatToIssueSchema = z.object({
    chatId: z.string().min(1, "ChatId is required"),
    issueId: z.string().min(1, "IssueID is required"),
    name: z.string().min(1, "Chat name is required").max(100),
});

export type IAddChatToIssueDto = z.infer<typeof AddChatToIssueSchema>;
export type IDeleteChatToIssueDto = z.infer<typeof DeleteChatToIssueSchema>;
export type IEditChatToIssueDto = z.infer<typeof EditChatToIssueSchema>;
export type IGetChatToIssueDto = z.infer<typeof GetChatToIssueSchema>;
