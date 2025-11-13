import { TFunction } from "i18next";
import React from "react";

export const ExitButton: React.FC<{
    handler: () => void;
    t: TFunction<"settings", undefined>;
}> = ({ handler, t }) => <button onClick={handler}>{t("menu.exit.title")}</button>;
