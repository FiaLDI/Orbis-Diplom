import React from "react";
import { ICompoentProps } from "./interface";

export const ButtonLink: React.FC<ICompoentProps> = ({
  children,
  href
}) => {
  return (
    <div className="group w-fit">
        <a href={href} className="relative px-2 py-1 
            transition-all duration-300 
            text-white/90 
            group-hover:text-cyan-300
            group-hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.6)] flex gap-3 cursor-pointer select-none"
        >
            <span className="
                absolute left-0 bottom-0 h-[2px] w-0 bg-cyan-300
                group-hover:w-full 
                transition-all duration-300
                rounded-full
                shadow-[0_0_8px_rgba(0,255,255,0.8)]" 
            />
            {children}
        </a>
    </div>
  );
};
