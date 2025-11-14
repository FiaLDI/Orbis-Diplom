import { useState, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setActiveChat } from "@/features/chat";
import { setSettingsActive } from "@/features/server";
import { toggleIssueMode } from "@/features/issue";
import { useCreateChatMutation, useEmitServerUpdate } from "@/features/server";
import { useTranslation } from "react-i18next";

export function useChatSidebarModel() {
    const { t } = useTranslation("chat");
    const dispatch = useAppDispatch();
    const { userId, isSettingsActive, activeServer } = useAppSelector((s) => ({
        userId: s.auth.user?.info.id,
        isSettingsActive: s.server.isSettingsActive,
        activeServer: s.server.activeserver,
    }));

    const [search, setSearch] = useState("");
    const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

    const [createChat] = useCreateChatMutation();
    const emit = useEmitServerUpdate();

    const isServer = useMemo(() => Boolean(activeServer?.id), [activeServer?.id]);

    const openMenu = useCallback((e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setMenu({ x: e.pageX, y: e.pageY });
    }, []);

    const closeMenu = useCallback(() => setMenu(null), []);

    const onToggleSettings = useCallback(() => {
        if (!isServer) return;
        dispatch(setSettingsActive(!isSettingsActive));
    }, [dispatch, isServer, isSettingsActive]);

    const onToggleProjects = useCallback(() => {
        if (!isServer) return;
        dispatch(toggleIssueMode());
        dispatch(setActiveChat(undefined));
    }, [dispatch, isServer]);

    const onCreateServerChat = useCallback(async () => {
        if (!activeServer?.id) return;
        try {
            (await createChat({ id: activeServer.id, data: "default chat" })) ?? Promise.resolve();
            emit("chats", activeServer.id);
        } finally {
            closeMenu();
        }
    }, [activeServer?.id, createChat, emit, closeMenu]);

    return {
        t,
        userId,
        activeServer,
        isServer,
        search,
        setSearch,
        menu,
        openMenu,
        closeMenu,
        onToggleSettings,
        onToggleProjects,
        onCreateServerChat,
    };
}
