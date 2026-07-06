import React from "react";

export interface ModalLayoutProps {
    children: React.ReactNode;
    open?: boolean;
    onClose?: () => void;
}
