import React from "react";

export const ChatLayout: React.FC<{
    view: React.ReactNode;
    head: React.ReactNode;
}> = ({ head, view }) => {
    return (
        <div className="flex flex-col min-h-screen w-full p-5 rounded-[5px]">
            {head}

            {view}
        </div>
    );
};
