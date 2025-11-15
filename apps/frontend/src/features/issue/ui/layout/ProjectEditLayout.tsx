import React from "react";

export const ProjectEditLayout: React.FC<{
    form: React.ReactNode;
    head: React.ReactNode;
}> = ({ form, head }) => {
    return (
        <div className="p-0 w-[420px] text-white">
            {
                <div className="bg-background w-full rounded flex items-center justify-between p-5">
                    {head}
                </div>
            }

            {form}
        </div>
    );
};
