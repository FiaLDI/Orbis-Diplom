import React from "react";

export const BackLink: React.FC<{ label: string; onClick: () => void; className?: string }> = ({
  label,
  onClick,
  className = "",
}) => (
  <span
    className={`
      text-center text-sm
      text-white/60 
      tracking-wide
      ${className}
    `}
  >
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="
        inline-block
        relative
        text-white/70 
        transition-all
        duration-300
        hover:text-cyan-300 
        hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]
      "
    >
      {/* underline glow */}
      <span
        className="
          absolute left-0 -bottom-0.5
          w-0 h-[2px]
          bg-cyan-300
          rounded-full
          transition-all duration-300
          shadow-[0_0_6px_rgba(0,255,255,0.7)]
          group-hover:w-full
        "
      />
      {label}
    </a>
  </span>
);
