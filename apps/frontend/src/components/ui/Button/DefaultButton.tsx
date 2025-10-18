import React from "react";

export const DefaultButton: React.FC<{
    children: React.ReactNode;
    handler: () => void;
}> = ({ children, handler }) => {
    return (
        <button
            className="cursor-pointer px-5 py-1 w-full whitespace-nowrap bg-[#1f77fa]/18 hover:bg-[#1f77fa]/50 rounded"
            onClick={() => handler()}
        >
            {children}
        </button>
    );
};
