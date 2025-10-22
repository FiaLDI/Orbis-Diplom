import { useEffect } from "react";
import { useAppSelector } from "@/app/hooks";

export const useApplyTheme = () => {
    const theme = useAppSelector((s) => s.settings.theme);
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);
};
