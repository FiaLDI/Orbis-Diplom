import { useLogoutUserMutation } from "@/features/auth";
import { useNavigate } from "react-router-dom";

import {
  AccountForm,
  AppearanceForm,
  LanguageForm,
  ProfileForm,
} from "@/features/settings";
import { useState } from "react";

export function useSettingsState() {
  const [currentSettingsPage, setCurrentSettingsPage] =
    useState<string>("Account");

  const SettingsContent: Record<string, React.FC<any>> = {
    Account: AccountForm,
    Profile: AppearanceForm,
    Appearance: LanguageForm,
    Language: ProfileForm,
  };

  const CurrentSettings = SettingsContent[currentSettingsPage];

  const menuItems = Object.keys(
    SettingsContent,
  ) as (keyof typeof SettingsContent)[];

  const setCurrentSettingsPageHandler = (
    value: keyof typeof SettingsContent,
  ) => {
    setCurrentSettingsPage(value);
  };

  return {
    setCurrentSettingsPageHandler,
    currentSettingsPage,
    menuItems,
    CurrentSettings,
  };
}
