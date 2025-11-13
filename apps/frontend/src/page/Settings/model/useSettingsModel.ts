import { useSettingsAction } from "./useSettingsAction";
import { useSettingsState } from "./useSettingsState";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";

export function useSettingsModel() {
    const actions = useSettingsAction();
    const state = useSettingsState();
    const { t } = useTranslation("settings");
    const settings = useAppSelector((s) => s.settings);
    const user = useAppSelector((s) => s.auth.user?.info);

    return {
        actions,
        state,
        t,
        settings,
        user,
    };
}
