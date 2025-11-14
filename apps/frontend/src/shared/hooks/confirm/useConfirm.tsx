import React, { useState, useCallback } from "react";
import { ConfirmModal } from "@/shared/ui/Modal/confirm/ConfirmModal";

export function useConfirm() {
    const [state, setState] = useState<{
        open: boolean;
        message?: string;
        resolve?: (result: boolean) => void;
    }>({ open: false });

    const confirm = useCallback(
        (message?: string): Promise<boolean> =>
            new Promise((resolve) => {
                setState({ open: true, message, resolve });
            }),
        []
    );

    const handleClose = useCallback(() => {
        setState((s) => ({ ...s, open: false }));
    }, []);

    const handleConfirm = useCallback(() => {
        if (state.resolve) state.resolve(true);
        handleClose();
    }, [state.resolve, handleClose]);

    const handleCancel = useCallback(() => {
        if (state.resolve) state.resolve(false);
        handleClose();
    }, [state.resolve, handleClose]);

    const modal = (
        <ConfirmModal
            open={state.open}
            message={state.message}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );

    return { confirm, modal };
}
