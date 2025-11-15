import React from "react";

export const ServerSettingsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex flex-col h-full w-full p-5 rounded-[5px] lg:h-screen text-white overflow-auto scroll-hidden">
        <div className="w-full h-full bg-background/50 overflow-auto scroll-hidden">{children}</div>
    </div>
);
