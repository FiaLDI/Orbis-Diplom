import React from "react";

export const ActionAllButton: React.FC<{
    handler: () => void;
    title: string;
}> = ({ handler, title }) => (
    <button
        onClick={handler}
        className="text-xs px-3 py-2 bg-[#ffffff22] hover:bg-[#ffffff33] rounded"
    >
        {title}
    </button>
);
