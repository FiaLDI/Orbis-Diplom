import { useState, useEffect, useRef } from "react";

export interface ContextMenuPosition<T> {
    x: number;
    y: number;
    data: T;
}

/**
 * Универсальный хук для контекстного меню
 * @template T — тип данных (например, message)
 * @template E — DOM элемент для ref (по умолчанию HTMLUListElement)
 */
export function useContextMenu<T, E extends HTMLElement = HTMLUListElement>() {
    const [contextMenu, setContextMenu] = useState<ContextMenuPosition<T> | null>(null);
    const menuRef = useRef<E | null>(null);

    const handleContextMenu = (e: React.MouseEvent, data: T) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.pageX, y: e.pageY, data });
    };

    const closeMenu = () => setContextMenu(null);

    useEffect(() => {
        if (!contextMenu) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                closeMenu();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeMenu();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [contextMenu]);

    return {
        contextMenu,
        handleContextMenu,
        closeMenu,
        menuRef,
    };
}
