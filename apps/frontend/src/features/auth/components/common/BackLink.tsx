import React from "react";

export const BackLink: React.FC<{ label: string; onClick: () => void }> = ({
  label,
  onClick,
}) => (
  <span className="text-center text-sm text-white/70">
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="underline hover:text-white"
    >
      {label}
    </a>
  </span>
);
