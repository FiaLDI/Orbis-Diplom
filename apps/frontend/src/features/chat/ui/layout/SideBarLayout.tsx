import React from "react";

export const SideBarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="border-r border-white/30 flex flex-col bg-background/20 gap-5 justify-between h-full w-full lg:min-w-[250px] lg:max-w-[250px] backdrop-blur-xl">
        {children}
    </div>
);
