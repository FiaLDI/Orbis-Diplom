import { Plus } from "lucide-react";
import React from "react";

export const CreateButton: React.FC<{
    handler: () => void;
}> = ({ handler }) => (
    <button className="cursor-pointer px-2 py-1 bg-foreground rounded-full" onClick={handler}>
        <Plus />
    </button>
);
