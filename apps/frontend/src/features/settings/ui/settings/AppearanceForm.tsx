import React from "react";
import { settingsState, useApperanceModel } from "@/features/settings";
import { AppearanceButton } from "../button/AppearanceButton";
import { SettingsLayout } from "../layout/SettingsLayout";

export const AppearanceForm: React.FC<{ settings?: settingsState }> = ({
  settings,
}) => {
  const { t, setStandartTheme, setLightTheme, setDarkTheme } =
    useApperanceModel();

  if (!settings) return null;

  return (
    <SettingsLayout>
      <h3 className="text-left">{t("menu.appearance.theme.title")}</h3>
      <AppearanceButton
        theme="standart"
        handler={setStandartTheme}
        title={t("menu.appearance.theme.standart")}
        isCurrent={settings.theme === "standart"}
      />
      <AppearanceButton
        theme="light"
        handler={setLightTheme}
        title={t("menu.appearance.theme.light")}
        isCurrent={settings.theme === "light"}
      />
      <AppearanceButton
        theme="dark"
        handler={setDarkTheme}
        title={t("menu.appearance.theme.dark")}
        isCurrent={settings.theme === "dark"}
      />
    </SettingsLayout>
  );
};
