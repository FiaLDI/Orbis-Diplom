import React from "react";

export const NotificationLayout: React.FC<{
    head: React.ReactNode;
    action: React.ReactNode;
    view: React.ReactNode;
}> = ({ head, action, view }) => {
    return (
        <div className="p-5 text-white bg-foreground rounded-lg max-h-[600px] overflow-y-auto min-w-[500px] ">
            <div className="flex justify-between items-center mb-3">
                {head}

                <div className="flex gap-2">{action}</div>
            </div>

            {view}
        </div>
    );
};
