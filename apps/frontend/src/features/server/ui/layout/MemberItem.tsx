import React from "react";

export const MemberItem = React.memo(function MemberItem({
    user,
    onClick,
    onContextMenu,
}: {
    user: {
        id: string;
        username: string;
        avatar_url?: string;
    };
    onClick: (id: string) => void;
    onContextMenu: (
        e: React.MouseEvent<HTMLElement>,
        u: {
            id: string;
            username: string;
            avatar_url?: string;
        }
    ) => void;
}) {
    return (
        <li
            className="h-fit bg-foreground/50 p-2 rounded-[10px]"
            onContextMenu={(e) => onContextMenu(e, user)}
        >
            <button
                className="flex items-center gap-3 w-full cursor-pointer"
                onClick={() => onClick(user.id)}
            >
                <img
                    src={user?.avatar_url || "/img/icon.png"}
                    alt=""
                    className="w-6 h-6 rounded-2xl shrink-0"
                />
                <div className="truncate text-left w-full">{user.username}</div>
            </button>
        </li>
    );
});
