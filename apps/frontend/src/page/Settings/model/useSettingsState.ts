import { useLogoutUserMutation } from "@/features/auth";
import { useNavigate } from "react-router-dom";

import {
    AccountSettings,
    AppearanceSettings,
    LanguageSettings,
    ProfileSettings,
} from "@/features/settings";
import { useState } from "react";

export function useSettingsState() {
    const [currentSettingsPage, setCurrentSettingsPage] = useState<string>("Account");

    const SettingsContent: Record<string, React.FC<any>> = {
        Account: AccountSettings,
        Profile: ProfileSettings,
        Appearance: AppearanceSettings,
        Language: LanguageSettings,
    };

    const CurrentSettings = SettingsContent[currentSettingsPage];

    const menuItems = Object.keys(SettingsContent) as (keyof typeof SettingsContent)[];

    const setCurrentSettingsPageHandler = (value: keyof typeof SettingsContent) => {
        setCurrentSettingsPage(value);
    };

    return {
        setCurrentSettingsPageHandler,
        currentSettingsPage,
        menuItems,
        CurrentSettings,
    };
}
