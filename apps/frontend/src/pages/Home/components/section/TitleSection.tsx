import React from "react";

export const TitleSection: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <h2
      className={`
        text-4xl lg:text-5xl 
        font-semibold 
        text-white 
        text-center 
        tracking-wide 
        relative 
        z-10

        /* Мягкое неоновое свечение */
        drop-shadow-[0_0_18px_rgba(0,255,255,0.45)]

        /* Плавное появление */
        animate-[fadeIn_1s_ease-out]

        ${className}
      `}
    >
      {/* Светящийся underline */}
      <span
        className="
          absolute left-1/2 -bottom-2 -translate-x-1/2
          w-24 h-[2px]
          bg-gradient-to-r 
          from-transparent 
          via-cyan-300 
          to-transparent
          drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]
          rounded-full
        "
      />

      {children}
    </h2>
  );
};
