import { cn } from "@/shared/utils/cn";
import React from "react";
import { ICompoentProps } from "./interface";

export const NavigationMenu: React.FC<ICompoentProps> = ({ navigate }) => {
  return (
    <ul
      className={cn(
        "flex flex-col lg:flex-col gap-2",
        "text-lg opacity-90",
        "[&>li]:cursor-pointer [&>li]:select-none",
        "[&>li]:transition-all [&>li]:duration-300",
        "[&>li]:px-2 [&>li]:py-1"
      )}
    >
      {/* item */}
      <li className="group">
        <a
          href="#start"
          className="block px-2 py-1 rounded-md
                     border-l-2 border-transparent
                     group-hover:border-cyan-300
                     group-hover:text-cyan-300
                     group-hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]
                     transition-all"
        >
          Загрузить
        </a>
      </li>

      <li className="group">
        <a
          href="#more"
          className="block px-2 py-1 rounded-md
                     border-l-2 border-transparent
                     group-hover:border-cyan-300
                     group-hover:text-cyan-300
                     group-hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]
                     transition-all"
        >
          Узнать больше
        </a>
      </li>

      <li className="group">
        <a
          onClick={() => navigate && navigate("political")}
          className="block px-2 py-1 rounded-md
                     border-l-2 border-transparent
                     group-hover:border-cyan-300
                     group-hover:text-cyan-300
                     group-hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]
                     transition-all"
        >
          Политика
        </a>
      </li>

      <li className="group">
        <a
          href="#support"
          className="block px-2 py-1 rounded-md
                     border-l-2 border-transparent
                     group-hover:border-cyan-300
                     group-hover:text-cyan-300
                     group-hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]
                     transition-all"
        >
          Поддержка
        </a>
      </li>
    </ul>
  );
};
