import React from "react";
import { Props } from "./interface";
import {
  CreateServerButton,
  MenuLayout,
  NotificationArea,
  PersonalButton,
  SettingsButton,
} from "../../ui";
import { useMenuModel } from "../../model/useMenuModel";
import { ServerList } from "../../ui/view/ServerList";

export const Component: React.FC<Props> = ({
  socket,
  notificationConnect,
  server,
}) => {
  const {
    avatarUrl,
    navigateToSettingsPage,
    setActiveServerHandler,
    setDisableServerHandler,
  } = useMenuModel(socket, server);

  return (
    <MenuLayout
      PersonalMode={
        <PersonalButton
          setDisableServer={setDisableServerHandler}
          avatarUrl={avatarUrl}
        />
      }
      ServerList={
        <ServerList
          servers={server.servers}
          activeServer={server.activeServer}
          setActiveServer={setActiveServerHandler}
        />
      }
      CreateServerForm={<CreateServerButton />}
      MenuNotification={
        <NotificationArea notificationConnect={notificationConnect} />
      }
      SettingsMode={
        <SettingsButton navigateToSettingsPage={navigateToSettingsPage} />
      }
    />
  );
};
