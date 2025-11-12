export interface ContextMenuItem {
    label: string;
    action: () => void;
    icon?: React.ReactNode;
    danger?: boolean;
    disabled?: boolean;
}

export interface AnimatedContextMenuProps {
    visible: boolean;
    x: number;
    y: number;
    items: ContextMenuItem[];
    menuRef: React.RefObject<HTMLElement>;
    onClose: () => void;
}
