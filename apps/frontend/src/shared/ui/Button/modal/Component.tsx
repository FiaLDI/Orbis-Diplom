import React from "react";
import { Props } from "./interface";

export const Component: React.FC<Props> = ({ children, handler }) => {
    return (
        <button
            className="bg-[#1f4de4] pl-5 pr-5 text-4xl  lg:text-base "
            onClick={() => handler()}
        >
            {children}
        </button>
    );
};
