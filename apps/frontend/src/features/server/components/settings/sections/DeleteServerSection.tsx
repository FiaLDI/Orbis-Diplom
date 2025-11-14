import React from "react";

type TFn = (key: string) => string;

export const DeleteServerSection: React.FC<{
    t: TFn;
    onDelete: () => Promise<void> | void;
}> = ({ t, onDelete }) => (
    <div className="p-5 flex flex-col w-full gap-5">
        <h4 className="text-2xl">{t("settings.delete_critical.title")}</h4>
        <button
            className="bg-red-500 px-5 py-3 rounded hover:bg-red-600 transition"
            onClick={onDelete}
        >
            {t("settings.delete_critical.submit")}
        </button>
    </div>
);
