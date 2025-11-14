import { useAppDispatch } from "@/app/hooks";
import { useTranslation } from "react-i18next";
import { setLanguage } from "../../slice";

export function useLanguageModel() {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation("settings");

  const handleChangeLanguage = (lang: "ru" | "en") => {
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  return {
    t,
    handleChangeLanguage,
  };
}
