import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { ChatList, setActiveChat } from "@/features/chat";
import {
    ContextMenu,
    ServerHeader,
    setSettingsActive,
    useCreateChatMutation,
    useEmitServerUpdate,
} from "@/features/server";
import { useLazyGetChatsUsersQuery } from "@/features/user";
import { toggleIssueMode } from "@/features/issue";
import { shallowEqual } from "react-redux";
import { useTranslation } from "react-i18next";

export const Component: React.FC = () => {
    const { userId, isSettingsActive, activeServer } = useAppSelector(
        (s) => ({
            userId: s.auth.user?.info.id,
            isSettingsActive: s.server.isSettingsActive,
            activeServer: s.server.activeserver,
        }),
        shallowEqual
    );

    const { t } = useTranslation("chat");

    const dispatch = useAppDispatch();
    const emitUpdate = useEmitServerUpdate();

    const [createText] = useCreateChatMutation();

    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const [search, setSearch] = useState<string>("");

    const isChat = !activeServer?.id;

    const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY });
    };

    const handleServerSettings = () => {
        if (!isChat) dispatch(setSettingsActive(!isSettingsActive));
    };

    const handleProject = () => {
        if (!isChat) dispatch(toggleIssueMode());
        dispatch(setActiveChat(undefined));
    };

    return (
        <div className=" flex flex-col bg-background/50 gap-5 justify-between h-full w-full lg:min-w-[250px] lg:max-w-[250px]">
            <div className="flex flex-col gap-0 h-full" onContextMenu={handleContextMenu}>
                {activeServer ? (
                    <ServerHeader
                        name={activeServer.name}
                        onSettingsToggle={handleServerSettings}
                        onProjectToggle={handleProject}
                    />
                ) : (
                    <div className="text-5xl lg:text-base flex flex-col text-white">
                        <div className="w-full flex justify-between text-white text-lg bg-background p-5">
                            <h4 className="truncate">{t("chat.personal.title")}</h4>
                        </div>
                        <div className="p-5 pb-0">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t("chat.search.placeholder")}
                                className="px-3 py-1 bg-transparent border-b outline-none box-border"
                            />
                        </div>
                    </div>
                )}

                <ChatList isServer={!isChat} search={search} />

                {!isChat && contextMenu && (
                    <ContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onClose={() => setContextMenu(null)}
                        onCreateChat={() => {
                            if (activeServer?.id) {
                                createText({ id: activeServer.id });
                            }
                            setContextMenu(null);

                            emitUpdate(activeServer?.id);
                        }}
                    />
                )}
            </div>
        </div>
    );
};
