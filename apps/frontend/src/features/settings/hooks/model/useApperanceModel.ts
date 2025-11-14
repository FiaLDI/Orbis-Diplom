import { useAppDispatch } from "@/app/hooks";
import { useTranslation } from "react-i18next";
import { setTheme } from "../../slice";

export function useApperanceModel() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("settings");

  const setStandartTheme = () => {
    dispatch(setTheme("standart"));
  };

  const setLightTheme = () => {
    dispatch(setTheme("light"));
  };

  const setDarkTheme = () => {
    dispatch(setTheme("dark"));
  };

  return {
    t,
    setStandartTheme,
    setLightTheme,
    setDarkTheme,
  };
}
