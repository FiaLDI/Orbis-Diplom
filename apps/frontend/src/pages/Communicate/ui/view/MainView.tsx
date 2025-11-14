import React from "react";

import {
  ChatArea,
  IssueArea,
  SettingsArea,
  FriendListArea,
  MemberListArea,
} from "../";

import { SideBar } from "@/features/chat";
import { CommunicateUI } from "../../model/types";
import { EmptyServerState } from "../empty/EmptyServerState";

export const MainView = ({
  ui,
  serverId,
  serverName,
  openProjectId,
}: {
  ui: CommunicateUI;
  serverId?: string;
  serverName?: string;
  openProjectId?: string;
}) => {
  return (
    <>
      {!ui.issueMode && <SideBar />}

      {ui.issueMode && ui.hasActiveServer && (
        <IssueArea
          serverId={serverId}
          projectId={openProjectId}
          serverName={serverName}
        />
      )}

      {ui.isPersonalChat && <ChatArea />}

      {ui.isServerChat && !ui.isSettingsActive && <ChatArea />}

      {ui.hasActiveServer &&
        !ui.hasActiveChat &&
        !ui.issueMode &&
        !ui.isSettingsActive && <EmptyServerState />}

      {ui.isSettingsActive && <SettingsArea />}

      {!ui.hasActiveServer && !ui.isPersonalChat && <FriendListArea />}

      {!ui.issueMode && <MemberListArea />}
    </>
  );
};
