import React from "react";
import { Props } from "./interface";
import { X } from "lucide-react";

export const Component: React.FC<Props> = ({ handler }) => {
    return (
        <div className="w-full lg:w-auto">
            <button className="cursor-pointer pl-5 p-2" onClick={() => handler()}>
                <X />
            </button>
        </div>
    );
};
