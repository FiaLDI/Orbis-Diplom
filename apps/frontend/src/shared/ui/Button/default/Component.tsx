import React from "react";
import { Props } from "./interface";

export const Component: React.FC<Props> = ({ children, handler }) => {
    return (
        <button
            className="cursor-pointer px-5 py-1 w-full whitespace-nowrap bg-background hover:bg-foreground/50 rounded"
            onClick={() => handler()}
        >
            {children}
        </button>
    );
};
