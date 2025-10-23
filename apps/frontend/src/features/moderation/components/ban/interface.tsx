export interface BanReasonModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason?: string) => void;
    username?: string;
}
