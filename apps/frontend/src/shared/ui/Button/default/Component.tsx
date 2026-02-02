import React from "react";
import { Props } from "./interface";

export const Component: React.FC<Props> = ({ children, handler }) => {
    return (
        <button
            className="cursor-pointer py-2 w-[200px] whitespace-nowrap bg-background/10 border border-white/30 hover:bg-foreground/50"
            onClick={() => handler()}
        >
            {children}
        </button>
    );
};
