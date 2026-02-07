import { TFunction } from "i18next";
import React from "react";

export const SideBarHead: React.FC<{
    search: string;
    onSearch: (v: string) => void;
    t: TFunction<"chat", undefined>;
}> = ({ search, onSearch, t }) => {
    return (
        <div className="text-5xl lg:text-base flex flex-col text-white">
            <div className="w-full flex justify-between border-b border-white/30 text-white text-lg bg-foreground/5 backdrop-blur-xl p-3">
                <h4 className="truncate">{t("chat.personal.title")}</h4>
            </div>
            <div className="p-5 pb-0">
                <input
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder={t("chat.search.placeholder")}
                    className="px-3 py-1 bg-transparent border-b outline-none box-border"
                />
            </div>
        </div>
    );
};
