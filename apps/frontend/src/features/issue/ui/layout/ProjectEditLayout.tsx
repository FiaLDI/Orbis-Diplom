import { ModalHead } from "@/shared/ui/Modal";
import React from "react";

export const ProjectEditLayout: React.FC<{
    form: React.ReactNode;
    head: React.ReactNode;
}> = ({ form, head }) => {
    return (
        <div className="p-0 w-[420px] text-white">
            {
                <ModalHead>
                    {head}
                </ModalHead>
            }

            {form}
        </div>
    );
};
