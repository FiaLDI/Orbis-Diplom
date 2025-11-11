import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setActiveServer, useLazyGetServersQuery } from "@/features/server";
import { useNavigate } from "react-router-dom";
import { setActiveChat } from "@/features/chat";
import { setOpenIssue, setOpenProject } from "@/features/issue";

export function useMenuModel(socket: any, server: any) {
    const dispatch = useAppDispatch();

    const avatarUrl = useAppSelector((s) => s.auth.user?.info.avatar_url);
    const [getServersUser] = useLazyGetServersQuery({});
    const navigator = useNavigate();

    React.useEffect(()=>{
        getServersUser({})
    }, [])

    const setActiveServerHandler = (id: string) => {
        const srv = server.servers.find((s: any) => s.id === id);
        if (!srv) return;

        if (server.activeserver?.id === id) return;

        socket?.emit("leave-server", server.activeserver?.id);
        dispatch(setActiveServer(srv));

        socket?.emit("join-server", id);
    };


    const setDisableServerHandler = () => {
        dispatch(setActiveChat(undefined));
        dispatch(setActiveServer(undefined));
        dispatch(setOpenProject(null));
        dispatch(setOpenIssue(null));
    }

    const navigateToSettingsPage = () => {
        navigator("/app/settings")
    }

    return {
        avatarUrl,
        setActiveServerHandler,
        setDisableServerHandler,
        navigateToSettingsPage
    };
}
