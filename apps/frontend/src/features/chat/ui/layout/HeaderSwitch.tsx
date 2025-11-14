import { ServerHeader } from "@/features/server";
import { SideBarHead } from "./SideBarHead";
import React from "react";
import { TFunction } from "i18next";

export const HeaderSwitch: React.FC<{
  isServer: boolean;
  serverName?: string;
  search: string;
  onSearch: (v: string) => void;
  onSettings: () => void;
  onProjects: () => void;
  t: TFunction<"chat", undefined>;
}> = ({
  isServer,
  serverName,
  search,
  onSearch,
  onSettings,
  onProjects,
  t,
}) => {
  return isServer ? (
    <ServerHeader
      name={serverName!}
      onSettingsToggle={onSettings}
      onProjectToggle={onProjects}
    />
  ) : (
    <SideBarHead t={t} search={search} onSearch={onSearch} />
  );
};
