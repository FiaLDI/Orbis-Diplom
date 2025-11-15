import { ListTree, MoveLeft, Orbit } from "lucide-react";
import React from "react";
import { ChangeViewButton } from "../button/ChangeViewButton";

type ModeView = "cluster" | "tree";

export const ChangeViewLayout: React.FC<{
    viewMode: ModeView;
    setViewMode: (mode: ModeView) => void;
}> = ({ setViewMode, viewMode }) => (
    <>
        <ChangeViewButton isCurrent={viewMode === "tree"} handler={() => setViewMode("tree")}>
            <ListTree className="w-4 h-4" />
        </ChangeViewButton>
        <ChangeViewButton isCurrent={viewMode === "cluster"} handler={() => setViewMode("cluster")}>
            <Orbit className="w-4 h-4" />
        </ChangeViewButton>
    </>
);
