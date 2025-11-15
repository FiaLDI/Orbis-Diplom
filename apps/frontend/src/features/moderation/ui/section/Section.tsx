import React from "react";

export const Section: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => (
    <div className={`p-5 flex flex-col gap-3 ${className ?? ""}`}>{children}</div>
);
