import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/auth";
import {
    AccountSettings,
    AppearanceSettings,
    LanguageSettings,
    ProfileSettings,
} from "@/features/settings";
import { useAppSelector } from "@/app/hooks";

const SettingsContent: Record<string, React.FC<any>> = {
    Account: AccountSettings,
    Profile: ProfileSettings,
    Appearance: AppearanceSettings,
    Language: LanguageSettings,
};

export const Component: React.FC = () => {
    const { t } = useTranslation("settings");
    const settings = useAppSelector((s) => s.settings);

    const user = useAppSelector((s) => s.auth.user?.info);
    const [currentSettingsPage, setCurrentSettingsPage] = useState<string>("Account");
    const [logout] = useLogoutUserMutation();
    const navigate = useNavigate();
    const CurrentSettings = SettingsContent[currentSettingsPage];

    const menuItems = Object.keys(SettingsContent);

    return (
        <div className="w-screen h-screen text-white overflow-auto">
            <div className="grid grid-cols-[1fr_5fr] h-full w-full">
                <ul className="w-full">
                    <div className="flex flex-col bg-background p-10 gap-5 h-full justify-between">
                        <div className="flex flex-col">
                            <button
                                onClick={() => navigate("/app")}
                                className="brightness-125 text-left mb-4"
                            >
                                {t("menu.back.title")}
                            </button>

                            {menuItems.map((option) => (
                                <div key={option} className="p-2">
                                    <button
                                        onClick={() => setCurrentSettingsPage(option)}
                                        className={`text-left w-full whitespace-nowrap ${
                                            currentSettingsPage === option
                                                ? "brightness-125"
                                                : "opacity-80 hover:opacity-100"
                                        }`}
                                    >
                                        {t(`menu.${option.toLowerCase()}.title`)}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="p-5">
                            <button
                                onClick={async () => {
                                    try {
                                        await logout({}).unwrap();
                                        navigate("/login");
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                            >
                                {t("menu.exit.title")}
                            </button>
                        </div>
                    </div>
                </ul>

                <div className="h-screen overflow-auto bg-[#2e3ed328]">
                    <h1 className="p-5 border-b border-b-[#ffffff52]">
                        {t(`title.${currentSettingsPage.toLowerCase()}`)}
                    </h1>
                    <div className="p-5">
                        <CurrentSettings settings={settings} user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
};
