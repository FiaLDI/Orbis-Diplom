import { TFunction } from "i18next";
import React from "react";

export const MenuItems: React.FC<{
  menuItems: string[];
  setCurrent: (option: string) => void;
  current: string;
  t: TFunction<"settings", undefined>;
}> = ({ menuItems, setCurrent, current, t }) => (
  <>
    {menuItems.map((option: any) => (
      <div key={option} className="p-2">
        <button
          onClick={() => setCurrent(option)}
          className={`text-left w-full whitespace-nowrap ${
            current === option
              ? "brightness-125"
              : "opacity-80 hover:opacity-100"
          }`}
        >
          {t(`menu.${option.toLowerCase()}.title`)}
        </button>
      </div>
    ))}
  </>
);
