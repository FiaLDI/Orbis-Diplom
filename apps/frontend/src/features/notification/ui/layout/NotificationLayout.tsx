import React from "react";

export const NotificationLayout: React.FC<{
    head: React.ReactNode;
    action: React.ReactNode;
    view: React.ReactNode;
}> = ({ head, action, view }) => {
    return (
        <div className="text-white bg-background rounded-lg max-h-[600px] overflow-y-auto min-w-[500px] flex flex-col gap-2 ">
            <div className="flex justify-between bg-foreground/20 items-center p-2 gap-10">
                {head}

                <div className="flex gap-2">{action}</div>
            </div>

            {view}
        </div>
    );
};
