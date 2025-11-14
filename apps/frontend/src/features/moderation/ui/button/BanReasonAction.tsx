import { MoveLeft } from "lucide-react";
import React from "react";

export const BanReasonAction: React.FC<{
  handler: () => void;
  title: string;
}> = ({ handler, title }) => (
  <button
    onClick={handler}
    className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
  >
    {title}
  </button>
);
