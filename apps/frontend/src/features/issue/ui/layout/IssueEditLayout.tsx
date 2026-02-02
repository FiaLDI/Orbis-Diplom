import { ModalHead } from "@/shared/ui/Modal";
import React from "react";

export const IssueEditLayout: React.FC<{
    head: React.ReactNode;
    form: React.ReactNode;
}> = ({ head, form }) => (
    <div className="text-white w-[500px]">
        <ModalHead>
            {head}
        </ModalHead>
        {form}
    </div>
);
