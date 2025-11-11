import React from "react";
import { Props } from "./interface";

export const Component: React.FC<Props> = ({ children, handler }) => {
    return (
        <button
            className="text-center bg-background py-3 lg:text-base rounded-2xl w-[150px]"
            onClick={() => handler()}
        >
            {children}
        </button>
    );
};
