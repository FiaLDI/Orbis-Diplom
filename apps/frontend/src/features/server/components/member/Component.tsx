import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useLazyGetInfoUserQuery } from "@/features/user";
import { AnimatedContextMenu } from "@/features/shared";
import { useContextMenu } from "@/features/shared";
import {
    useBanUserMutation,
    useKickUserMutation,
    useUnbanUserMutation,
} from "@/features/moderation";
import { BanReasonModal } from "@/features/moderation";
import { Member } from "./interface";
import { useTranslation } from "react-i18next";

export const Component: React.FC = () => {
    const membersServer = useAppSelector((s) => s.server.activeserver?.users) as
        | Member[]
        | undefined;
    const activeserverId = useAppSelector((s) => s.server.activeserver?.id) as number | undefined;
    const chatinfo = useAppSelector((s) => s.chat.activeChat as any);
    const meId = useAppSelector((s) => s.auth.user?.info.id) as number | undefined;
    const [banModal, setBanModal] = useState<{ open: boolean; userId?: number; username?: string }>(
        {
            open: false,
        }
    );

    const { t } = useTranslation("server");

    const dispatch = useAppDispatch();
    const [triggerProfile] = useLazyGetInfoUserQuery();

    const users: Member[] | undefined = activeserverId ? membersServer : chatinfo?.users;
    const myServerPermissions: string[] = [
        "BAN_MEMBERS",
        "KICK_MEMBERS",
        "VIEW_AUDIT_LOG",
        "MANAGE_ROLES",
        "MANAGE_CHANNELS",
        "MANAGE_MESSAGES",
        "ADMINISTRATOR",
    ];

    const canKick = myServerPermissions.includes("KICK_MEMBERS");
    const canBan = myServerPermissions.includes("BAN_MEMBERS");

    const [banUser, { isLoading: banLoading }] = useBanUserMutation();
    const [unbanUser, { isLoading: unbanLoading }] = useUnbanUserMutation();
    const [kickUser, { isLoading: kickLoading }] = useKickUserMutation();

    const { contextMenu, handleContextMenu, closeMenu, menuRef } = useContextMenu<Member>();

    const onViewProfile = (id: number) => triggerProfile(id);

    const doKick = async (userId: number) => {
        if (!activeserverId) return;
        try {
            await kickUser({ serverId: activeserverId, userId }).unwrap();
        } catch (e: any) {}
    };

    const doUnban = async (userId: number) => {
        if (!activeserverId) return;
        try {
            await unbanUser({ serverId: activeserverId, userId }).unwrap();
        } catch (e: any) {}
    };

    const menuItems = useMemo(() => {
        if (!contextMenu?.data) return [];
        const target = contextMenu.data;
        const isSelf = meId === target.id;

        return [
            {
                label: t("moderate.open"),
                action: () => onViewProfile(target.id),
                disabled: false,
            },
            {
                label: t("moderate.copy"),
                action: () => navigator.clipboard?.writeText(String(target.id)),
            },
            { label: "—", action: () => {} }, // разделитель (отрисуем как disabled)
            {
                label: t("moderate.kick"),
                action: () => doKick(target.id),
                danger: true,
                disabled: !canKick || isSelf || !activeserverId || kickLoading,
            },
            {
                label: t("moderate.ban"),
                action: async () => {
                    setBanModal({ open: true, userId: target.id, username: target.username });
                },
                danger: true,
                disabled: !canBan || isSelf || !activeserverId || banLoading,
            },
            {
                label: t("moderate.unban"),
                action: () => doUnban(target.id),
                disabled: !canBan || isSelf || !activeserverId || unbanLoading,
            },
        ].filter(Boolean) as any[];
    }, [
        contextMenu?.data,
        meId,
        canKick,
        canBan,
        activeserverId,
        kickLoading,
        banLoading,
        unbanLoading,
    ]);

    const handleLeftClick = (id: number) => {
        onViewProfile(id);
    };

    if (!users?.length) return null;

    return (
        <>
            <div className="bg-background/50 text-white text-lg flex flex-col w-[200px] lg:w-[400px] lg:min-w-[250px] lg:max-w-[250px]">
                <h2 className="whitespace-nowrap bg-background p-5">
                    Участники: {users?.length ?? 0}
                </h2>

                <ul className="flex flex-col gap-3 h-full p-3">
                    {users?.map((val, idx) => (
                        <li
                            key={`user-server-${idx}`}
                            className="h-fit bg-foreground/50 p-2 rounded-[10px]"
                            onContextMenu={(e) => handleContextMenu(e, val)}
                        >
                            <button
                                className="flex items-center gap-3 w-full cursor-pointer"
                                onClick={() => handleLeftClick(val.id)}
                            >
                                <div className="shrink-0">
                                    <img
                                        src={val?.avatar_url || "/img/icon.png"}
                                        alt=""
                                        className="w-6 h-6 rounded-2xl"
                                    />
                                </div>

                                <div className="truncate text-left w-full">{val.username}</div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <AnimatedContextMenu
                visible={Boolean(contextMenu)}
                x={contextMenu?.x ?? 0}
                y={contextMenu?.y ?? 0}
                items={menuItems.map((it: any) =>
                    it.label === "—" ? { label: "────────", action: () => {}, disabled: true } : it
                )}
                onClose={closeMenu}
                menuRef={menuRef as React.RefObject<HTMLElement>}
            />

            <BanReasonModal
                open={banModal.open}
                username={banModal.username}
                onClose={() => setBanModal({ open: false })}
                onConfirm={async (reason) => {
                    if (!banModal.userId || !activeserverId) return;
                    try {
                        await banUser({
                            serverId: activeserverId,
                            userId: banModal.userId,
                            reason,
                        }).unwrap();
                    } catch (e: any) {
                    } finally {
                        setBanModal({ open: false });
                    }
                }}
            />
        </>
    );
};
