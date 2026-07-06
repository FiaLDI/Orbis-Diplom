import { useState, useCallback } from "react";

export function useIssueEditModal() {
    const [open, setOpen] = useState(false);
    const [editingIssue, setEditingIssue] = useState<any | null>(null);

    const openModal = useCallback((issue?: any) => {
        setOpen(false);
        setTimeout(() => {
            setEditingIssue(issue ?? null);
            setOpen(true);
        }, 10);
    }, []);

    const closeModal = useCallback(() => {
        setOpen(false);
        setEditingIssue(null);
    }, []);

    return {
        open,
        editingIssue,
        openModal,
        closeModal,
    };
}
