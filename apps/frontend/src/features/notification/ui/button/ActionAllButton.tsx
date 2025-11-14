import React from "react";

export const ActionAllButton: React.FC<{
    handler: () => void;
    title: string;
}> = ({ handler, title }) => (
    <button
        onClick={handler}
        className="text-xs px-2 py-1 bg-[#ffffff22] hover:bg-[#ffffff33] rounded"
    >
        {title}
    </button>
);
