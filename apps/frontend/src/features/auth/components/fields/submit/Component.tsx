import React from "react";
import { SubmitButtonProps } from "./interface";

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    label,
    disabled,
}) => (
    <button type="submit" disabled={disabled} className="text-3xl lg:text-base">
        {label}
    </button>
);