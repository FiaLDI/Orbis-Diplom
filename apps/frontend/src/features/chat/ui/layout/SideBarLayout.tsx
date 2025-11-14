import React from "react";

export const SideBarLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="flex flex-col bg-background/50 gap-5 justify-between h-full w-full lg:min-w-[250px] lg:max-w-[250px]">
    {children}
  </div>
);
