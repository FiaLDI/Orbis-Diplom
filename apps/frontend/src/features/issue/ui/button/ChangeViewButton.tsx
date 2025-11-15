import React from "react";

export const ChangeViewButton: React.FC<{
    isCurrent: boolean;
    handler: () => void;
    children: React.ReactNode;
}> = ({ isCurrent, handler, children }) => (
    <>
        <button
            data-current={isCurrent}
            className={`px-2 py-1 rounded bg-foreground/50 data-[current=true]:bg-foreground`}
            onClick={handler}
        >
            {children}
        </button>
    </>
);
