import React from "react";
import { SettingsLayout } from "../../ui/layout/SettingsLayout";
import { settingsState, useLanguageModel } from "../..";

export const LanguageForm: React.FC<{ settings?: settingsState }> = ({
  settings,
}) => {
  const { t, handleChangeLanguage } = useLanguageModel();

  if (!settings) return null;

  return (
    <SettingsLayout>
      <h3 className="bg-[#ffffff11] p-2 flex justify-between">
        {t("menu.language.label")}
      </h3>

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
    </SettingsLayout>
  );
};
