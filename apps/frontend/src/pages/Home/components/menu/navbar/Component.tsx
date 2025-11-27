import { cn } from "@/shared/utils/cn";
import React from "react";
import { ICompoentProps } from "./interface";

export const NavigationMenu: React.FC<ICompoentProps & { mobile?: boolean }> = ({
  navigate,
  mobile = false,
}) => {
  return (
    <ul
      className={cn(
        "flex gap-6 items-center",
        mobile && "flex-col gap-4 py-5 text-2xl border-t border-cyan-400/10",
        !mobile && "text-lg"
      )}
    >
      {[
        { label: "Загрузить", href: "#start" },
        { label: "Узнать больше", href: "#more" },
        { label: "Политика", onClick: () => navigate?.("political") },
        { label: "Поддержка", href: "#support" },
      ].map((item, i) => (
        <li key={i} className="group">
          <a
            href={item.href}
            onClick={item.onClick}
            className="
              relative px-2 py-1 
              transition-all duration-300 
              text-white/90 
              group-hover:text-cyan-300
              group-hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]
            "
          >
            {/* underline glow */}
            <span className="
              absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-300
              group-hover:w-full 
              transition-all duration-300
              rounded-full
              shadow-[0_0_8px_rgba(0,255,255,0.8)]
            " />
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
};
