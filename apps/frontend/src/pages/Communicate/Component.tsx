import React from "react";
import { useCommunicateModel } from "./model/useCommunicateModel";
import { PageLayout, MainView } from "./ui";
import { AppMenu } from "./components";
import { UserProfile } from "@/features/user";
import { useModerationListener } from "@/features/server";

export const Component = () => {
  const {
    socket,
    ui,
    openProjectId,
    serverId,
    serverName,
    isConnected,
    server,
  } = useCommunicateModel();

  const { modal } = useModerationListener(socket);

  if (!socket) return null;
  if (!ui) return null;

  return (
    <>
      {modal}
      <PageLayout
        sidebar={
          <AppMenu
            socket={socket}
            notificationConnect={isConnected}
            server={server}
          />
        }
        profile={<UserProfile />}
        main={
          <MainView
            ui={ui}
            serverId={serverId}
            serverName={serverName}
            openProjectId={openProjectId}
          />
        }
      />
    </>
  );
};
