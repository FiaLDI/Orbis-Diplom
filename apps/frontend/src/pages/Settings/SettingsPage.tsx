import React from "react";
import { useSettingsModel } from "./model/useSettingsModel";
import { SettingsLayout } from "./ui/layout/SettingsLayout";
import { SettingsView } from "./ui/view/SettingsView";
import { BackButton } from "./ui/button/Back";
import { ExitButton } from "./ui/button/Exit";
import { MenuItems } from "./ui/view/MenuItems";

export const SettingsPage: React.FC = () => {
  const { actions, state, t, settings, user } = useSettingsModel();

  return (
    <SettingsLayout
      menu={
        <MenuItems
          menuItems={state.menuItems}
          setCurrent={state.setCurrentSettingsPageHandler}
          current={state.currentSettingsPage}
          t={t}
        />
      }
      back={<BackButton handler={actions.backHandler} t={t} />}
      exit={<ExitButton handler={actions.logoutHandler} t={t} />}
      current={
        <SettingsView {...state} t={t} settings={settings} user={user} />
      }
    />
  );
};
