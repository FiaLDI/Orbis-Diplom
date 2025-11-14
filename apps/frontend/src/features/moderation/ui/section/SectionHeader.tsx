import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

export const SectionHeader: React.FC<{
    title: React.ReactNode;
    open?: boolean;
    onToggle?: () => void;
    action?: React.ReactNode;
}> = ({ title, open, onToggle, action }) => (
    <div className="flex items-center justify-between">
        <div className="text-2xl flex items-center gap-2">
            {typeof open === "boolean" && (
                <button onClick={onToggle} className="p-1 -m-1">
                    {open ? <ChevronDown /> : <ChevronUp />}
                </button>
            )}
            {title}
        </div>
        {action}
    </div>
);
