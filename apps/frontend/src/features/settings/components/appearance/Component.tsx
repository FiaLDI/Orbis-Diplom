import { useAppDispatch, useAppSelector } from "@/app/hooks";
import React from "react";
import { setTheme } from "../../slice";
import { useTranslation } from "react-i18next";

export const Component: React.FC = () => {
    const settings = useAppSelector((s) => s.settings);
    const dispatch = useAppDispatch();
    const { t } = useTranslation("settings");
  
    return (
        <div className="flex flex-col gap-5 p-5 text-center min-h-[200px] test-bg ">
            <h3 className="text-left">{t("menu.appearance.theme.title")}</h3>
            <button 
              className={
                settings.theme === "standart" ? 
                "bg-blue-950 p-10 w-[250px] border border-white cursor-pointer": 
                "bg-blue-950 p-10 w-[250px] cursor-pointer"
              }
              onClick={()=>dispatch(setTheme("standart"))}
            >
              <div className="">{t("menu.appearance.theme.standart")}</div>
            </button>
            <button 
              className=
                {
                  settings.theme === "light" ? 
                  "bg-gray-400 p-10 w-[250px] border border-white cursor-pointer": 
                  "bg-gray-400 p-10 w-[250px] cursor-pointer"
                }
              onClick={()=>dispatch(setTheme("light"))}
              >
              <div className="">{t("menu.appearance.theme.light")}</div>
            </button>
            <button 
              className={
                settings.theme === "dark" ? 
                "bg-gray-900 p-10 w-[250px] border border-white cursor-pointer": 
                "bg-gray-900 p-10 w-[250px] cursor-pointer"
              }
              onClick={()=>dispatch(setTheme("dark"))}
              >
              <div className="">{t("menu.appearance.theme.dark")}</div>
            </button>
        </div>
    );
};
