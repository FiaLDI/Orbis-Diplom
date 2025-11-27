import React from "react";
import { ICompoentProps } from "./interface";

export const ButtonHome: React.FC<ICompoentProps> = ({
  children,
  handler = () => {},
  buttonclass = "",
}) => {
  return (
    <button
      onClick={() => handler()}
      className={`
        relative group 
        px-8 py-4 
        text-2xl lg:text-xl 
        font-semibold 
        w-full 
        rounded-xl 
        tracking-wide 
        transition-all duration-300 
        bg-[rgba(0,0,0,0.25)]
        backdrop-blur-sm

        /* Неоновая рамка */
        border border-cyan-300/40 
        shadow-[0_0_20px_4px_rgba(0,200,255,0.25)]

        /* Цвет текста */
        text-white 

        /* Hover-эффект — яркий неон */
        hover:border-cyan-300 
        hover:shadow-[0_0_30px_10px_rgba(0,255,255,0.45)]
        hover:text-cyan-200

        /* Активное состояние */
        active:scale-[0.97]

        ${buttonclass}
      `}
    >
      <span
        className="
          pointer-events-none
          absolute inset-0 
          bg-gradient-to-r from-transparent via-white/20 to-transparent 
          opacity-0 group-hover:opacity-100 
          translate-x-[-150%]
          group-hover:translate-x-[150%] 
          transition-all duration-[1200ms] ease-out
        "
      />

      {children}
    </button>
  );
};
