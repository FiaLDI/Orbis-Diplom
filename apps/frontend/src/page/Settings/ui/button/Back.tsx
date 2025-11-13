import { TFunction } from "i18next";
import React from "react";

export const BackButton: React.FC<{
    handler: () => void;
    t: TFunction<"settings", undefined>;
}> = ({ handler, t }) => (
    <button onClick={handler} className="brightness-125 text-left mb-4">
        {t("menu.back.title")}
    </button>
);
