import { useEffect } from "react";
import { useAppSelector } from "@/app/hooks";

export const useApplyTheme = () => {
  const theme = useAppSelector((s) => s.settings.theme);
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("theme-standart", "theme-light", "theme-dark");
    root.classList.add(`theme-${theme}`);
  }, [theme]);
};
