import { ModalHead } from "@/shared/ui/Modal";
import React from "react";

export const IssueAssignLayout: React.FC<{
    head: React.ReactNode;
    search: React.ReactNode;
    result: React.ReactNode;
}> = ({ head, search, result }) => (
    <div className="w-[500px] text-white">
        <ModalHead>
            {head}
        </ModalHead>
        <div className="p-5 flex flex-col gap-5 w-full">
            {search}

            <div className="max-h-[300px] overflow-y-auto space-y-1">{result}</div>
        </div>
    </div>
);
