import React from "react";
import { SubmitButtonProps } from "./interface";

export const SubmitButton: React.FC<SubmitButtonProps> = ({ label, disabled }) => (
    <button
        type="submit"
        disabled={disabled}
        className="cursor-pointer text-base whitespace-nowrap px-2 py-3 bg-foreground/30 rounded-md"
    >
        {label}
    </button>
);
