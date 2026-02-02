import React from "react";

export const SettingsLayout: React.FC<{
  menu: React.ReactNode;
  back: React.ReactNode;
  exit: React.ReactNode;
  current: React.ReactNode;
}> = ({ menu, back, exit, current }) => {
  return (
    <div className="w-screen h-screen text-white overflow-auto">
      <div className="grid grid-cols-[1fr_6fr] h-full w-full">
        <ul className="w-full">
          <div className="order-10 min-w-[180px]
      backdrop-blur-sm border-r border-white/30 lg:order-0 w-full flex lg:flex-col justify-between items-center lg:h-full bg-background/50 p-3 pt-5 pb-5 relative">
            <div className="flex flex-col">
              {back}

              {menu}
            </div>

            <div className="p-5">{exit}</div>
          </div>
        </ul>

        {current}
      </div>
    </div>
  );
};
