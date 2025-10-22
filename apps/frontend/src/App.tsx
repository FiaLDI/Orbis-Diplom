import React from "react";
import { PagesRouter } from "@/routes";
import { useAutoRefreshToken } from "./features/auth/hooks/useAutoRefreshToken";
import { useApplyTheme } from "@/features/settings";
import { useAppSelector } from "./app/hooks";

export const App: React.FC = () => {
  const theme = useAppSelector((s) => s.settings.theme);
  useAutoRefreshToken(12);
  useApplyTheme();

  const getBackgroundClass = () => {
    switch (theme) {
      case "light":
        return "bg-body-texture-light";
      case "dark":
        return "bg-body-texture-black";
      case "standart":
        return "bg-body-texture-standart";
      default:
        return "bg-body-texture-standart";
    }
  };

  return (
    <>
      <div
        className={`${getBackgroundClass()} fixed w-full h-full -z-50 overflow-hidden bg-cover bg-no-repeat`}
      ></div>
      <PagesRouter />
    </>
  );
};
