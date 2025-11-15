export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

export interface ToastState {
    toasts: Toast[];
    position: ToastPosition;
}

export type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";
