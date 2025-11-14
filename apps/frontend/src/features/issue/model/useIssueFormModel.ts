import { useForm, SubmitHandler } from "react-hook-form";
import { IssueFormData } from "../components/issue/create/interface";
import { Statuses } from "../types";
import { useEffect, useState } from "react";

interface Params {
    serverId: string;
    projectId: string;
    emitServerUpdate: any;
    statuses: { id: number; name: Statuses }[];
    initialData?: any;
    updateIssue: any;
    createIssue: any;
    onClose: () => void;
}

export function useIssueFormModel({
    serverId,
    projectId,
    emitServerUpdate,
    statuses,
    initialData,
    updateIssue,
    createIssue,
    onClose,
}: Params) {
    const form = useForm<IssueFormData>({
        defaultValues: {
            title: initialData?.title ?? "",
            description: initialData?.description ?? "",
            statusId: initialData?.status_id ?? statuses?.[0]?.id ?? 0,
            priority: initialData?.priority ?? "",
            due_date: initialData?.due_date
                ? new Date(initialData.due_date).toISOString().slice(0, 10)
                : "",
            parent_id: initialData?.parent_id ?? null,
        },
    });

    const onSubmit: SubmitHandler<IssueFormData> = async (data) => {
        if (!data.title.trim() || !data.priority || !data.statusId) return;

        try {
            const payload = {
                title: data.title,
                description: data.description,
                statusId: Number(data.statusId),
                priority: data.priority,
                due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
                parent_id: data.parent_id || null,
            };

            if (initialData) {
                await updateIssue(payload, initialData.id);
            } else {
                await createIssue(payload);
            }

            onClose();
        } catch (err) {
            console.error("❌ Failed to save issue:", err);
        }
    };

    return { form, onSubmit };
}
