import React from "react";

export const SettingsLayout: React.FC<{children: React.ReactNode}> = ({children}) => {

  return (
    <div className="flex flex-col gap-4 p-5 bg-foreground/30 w-full text-white">
      {children}
    </div>
  );
};
