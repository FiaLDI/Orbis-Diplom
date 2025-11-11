import React from "react";
import { useCommunicateModel } from "./model/useCommunicateModel";
import {
    PageLayout,
    MainView
} from "./ui";
import { AppMenu } from "./components";
import { Profile } from "@/features/user";

export const Component = () => {
    const { socket, ui, openProjectId, serverId, serverName, isConnected } = useCommunicateModel();

    if (!socket) return null;
    if (!ui) return null;

    return (
        <PageLayout
            sidebar={<AppMenu socket={socket} notificationConnect={isConnected} />}
            profile={<Profile />}
            main={
                <MainView
                    ui={ui}
                    serverId={serverId}
                    serverName={serverName}
                    openProjectId={openProjectId}
                />
            }
        />
    );
};
