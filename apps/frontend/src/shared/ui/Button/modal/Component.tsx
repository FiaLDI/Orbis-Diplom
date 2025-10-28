import React from "react";
import { Props } from "./interface";

export const Component: React.FC<Props> = ({ children, handler }) => {
    return (
        <button
            className="bg-background p-3 px-10 w-fit lg:text-base rounded-2xl "
            onClick={() => handler()}
        >
            {children}
        </button>
    );
};
