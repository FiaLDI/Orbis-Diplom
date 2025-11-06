

export interface ContextMenuProps {
    visible: boolean;
    x: number;
    y: number;
    onClose: () => void;
    items: { label: string; action: () => void; danger?: boolean }[];
    menuRef: React.RefObject<HTMLUListElement>;
}