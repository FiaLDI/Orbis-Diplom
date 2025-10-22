import React from "react";
import { Props } from "./interface";

export const Component: React.FC<Props> = ({ change, value, name, placeHolder, disabled=false }) => {
    return (
        <input
            className="w-full p-2 border-b outline-none bg-transparent text-white placeholder:text-white/60"
            type="text"
            placeholder={placeHolder}
            name={name}
            value={value}
            onChange={(e) => change(e)}
            disabled={disabled}
        />
    );
};
