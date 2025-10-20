import React from "react";
import { PagesRouter } from "@/routes";
import { useAutoRefreshToken } from "./features/auth/hooks/useAutoRefreshToken";
import { useApplyTheme } from "@/features/settings";
import { useAppSelector } from "./app/hooks";

export const App: React.FC = () => {
    const theme = useAppSelector(s => s.settings.theme);
    useAutoRefreshToken(12);
    
    useApplyTheme();
    return (
        <>
            <div className={
                theme === "light" ?
                "bg-body-texture-light fixed w-full h-full -z-50 overflow-hidden bg-cover bg-no-repeat" : 
                "bg-body-texture-black fixed w-full h-full -z-50 overflow-hidden bg-cover bg-no-repeat"
            }></div>
            <PagesRouter />
        </>
    );
};
