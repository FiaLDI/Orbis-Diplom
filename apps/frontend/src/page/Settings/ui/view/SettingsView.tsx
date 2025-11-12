import { UserData } from "@/features/auth";
import { settingsState } from "@/features/settings";
import { TFunction } from "i18next";
import React from "react";

type SettingsViewProps = {
  setCurrentSettingsPageHandler: (value: string) => void;
  currentSettingsPage: string;
  menuItems: string[];
  CurrentSettings: React.FC<{
    settings: settingsState;
    user: UserData["info"];
  }>;
  t: TFunction<"settings", undefined>;
  settings: settingsState;
  user?: UserData["info"];
};

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentSettingsPage,
  t,
  settings,
  user,
  CurrentSettings,
}) => {
  if (!user) return null;
  return (
    <div className="h-screen overflow-auto bg-[#2e3ed328]">
      <h1 className="p-5 border-b border-b-[#ffffff52]">
        {t(`title.${currentSettingsPage.toLowerCase()}`)}
      </h1>
      <div className="p-5">
        <CurrentSettings settings={settings} user={user} />
      </div>
    </div>
  );
};
