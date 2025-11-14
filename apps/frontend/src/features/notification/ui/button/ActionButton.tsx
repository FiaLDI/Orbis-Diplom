import React, { Children } from "react";

export const ActionButton: React.FC<{
  handler: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ handler, title, children }) => (
  <button
    onClick={handler}
    title={title}
    className="text-xs px-2 py-1 bg-[#ffffff22] hover:bg-[#ffffff33] rounded"
  >
    {children}
  </button>
);
