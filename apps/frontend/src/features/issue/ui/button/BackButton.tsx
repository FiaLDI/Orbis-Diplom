import { MoveLeft } from "lucide-react";
import React from "react";

export const BackButton: React.FC<{
    handler: () => void;
}> = ({ handler }) => {
    return (
        <button onClick={handler}>
            <MoveLeft />
        </button>
    );
};
