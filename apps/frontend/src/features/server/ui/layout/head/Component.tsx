import { Bolt, SlidersHorizontal, Target } from "lucide-react";
import React from "react";
import { Props } from "./interface";

export const Component: React.FC<Props> = ({
  name,
  onSettingsToggle,
  onProjectToggle,
}) => {
  return (
    <div className="w-full flex justify-between border-b border-white/30 text-white text-lg bg-foreground/5 backdrop-blur-xl p-3">
      <h4 className="truncate">{name}</h4>
      <div className="flex gap-3">
        <button
          className="cursor-pointer"
          aria-label="Target"
          onClick={onProjectToggle}
        >
          <Target />
        </button>
        <button
          className="cursor-pointer"
          aria-label="Server settings"
          onClick={onSettingsToggle}
        >
          <SlidersHorizontal />
        </button>
      </div>
    </div>
  );
};
