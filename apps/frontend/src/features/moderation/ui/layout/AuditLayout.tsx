import React from "react";

export const AuditLayout: React.FC<{
  header: React.ReactNode;
  members: React.ReactNode;
  banned: React.ReactNode;
  logs: React.ReactNode;
}> = ({ header, members, banned, logs }) => (
  <div className="flex flex-col w-full p-0 rounded-[5px] text-white">
    <div className="w-full h-full bg-background/50">
      <div className="bg-foreground w-full rounded flex items-center justify-between p-5">
        {header}
      </div>
      <div>{members}</div>
      <div className="border-t border-white/10">{banned}</div>
      <div>{logs}</div>
    </div>
  </div>
);
