import React from "react";
import { useCommunicateModel } from "./model/useCommunicateModel";
import { PageLayout, MainView } from "./ui";
import { AppMenu } from "./components";
import { UserProfile } from "@/features/user";

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

  if (!socket) return null;
  if (!ui) return null;

  return (
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
  );
};
