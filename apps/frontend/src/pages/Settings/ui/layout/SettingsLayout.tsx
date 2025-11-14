import React from "react";

export const SettingsLayout: React.FC<{
  menu: React.ReactNode;
  back: React.ReactNode;
  exit: React.ReactNode;
  current: React.ReactNode;
}> = ({ menu, back, exit, current }) => {
  return (
    <div className="w-screen h-screen text-white overflow-auto">
      <div className="grid grid-cols-[1fr_5fr] h-full w-full">
        <ul className="w-full">
          <div className="flex flex-col bg-background p-10 gap-5 h-full justify-between">
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
