import React from "react";
import { Props } from "./interface";

export const Component: React.FC<Props> = ({ children, handler }) => {
    return (
        <button
            className="cursor-pointer py-1 w-[200px] whitespace-nowrap bg-background hover:bg-foreground/50 rounded"
            onClick={() => handler()}
        >
            {children}
        </button>
    );
};
