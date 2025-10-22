import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setLanguage } from "../../slice";
import { useTranslation } from "react-i18next";

export const Component: React.FC = () => {
    const settings = useAppSelector((s) => s.settings);
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation("settings");

    const handleChangeLanguage = (lang: "ru" | "en") => {
        dispatch(setLanguage(lang));
        i18n.changeLanguage(lang);
        localStorage.setItem("i18nextLng", lang);
    };

    return (
        <div className="flex flex-col gap-5 p-5 text-center">
            <h3 className="bg-[#ffffff11] p-2 flex justify-between">{t("menu.language.label")}</h3>

            <div className="p-2 flex flex-col gap-2">
                {(["ru", "en"] as const).map((lng) => (
                    <div key={lng} className="w-[150px] mx-auto">
                        <button
                            disabled={settings.language === lng}
                            className="py-2 w-full bg-[#1f4bda5b] cursor-pointer disabled:bg-[#7085cb5b]"
                            onClick={() => handleChangeLanguage(lng)}
                        >
                            {t(`menu.language.${lng}`)}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
