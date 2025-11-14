import React from "react";

export const NotificationHead: React.FC<{
  title: string;
  connected: boolean;
  online: string;
  offline: string;
}> = ({ title, connected, online, offline }) => (
  <h3 className="text-lg font-semibold flex items-center gap-2">
    {title}{" "}
    {connected ? (
      <span className="text-green-400 text-sm">({online})</span>
    ) : (
      <span className="text-gray-400 text-sm">({offline})</span>
    )}
  </h3>
);
