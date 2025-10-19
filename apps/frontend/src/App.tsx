import React from "react";
import { PagesRouter } from "@/routes";
import { useAutoRefreshToken } from "./features/auth/hooks/useAutoRefreshToken";
import { useApplyTheme } from "@/features/settings";

export const App: React.FC = () => {
    useAutoRefreshToken(12);
    
    useApplyTheme();
    return (
        <>
            <div className="bg-custom fixed w-full h-full -z-50 overflow-hidden bg-cover bg-no-repeat"></div>
            <PagesRouter />
        </>
    );
};
