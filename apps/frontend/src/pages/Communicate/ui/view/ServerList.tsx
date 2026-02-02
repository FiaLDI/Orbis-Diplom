import React from "react";

export const ServerList = ({
  servers,
  activeServer,
  setActiveServer,
}: {
  servers: any;
  activeServer: any;
  setActiveServer: any;
}) => {
  if (!servers) return null;
  if (!servers.length) return null;

  return (
    servers.length &&
    servers.map((val: any, index: number) => (
      <div
        className="w-8 h-8 transition-transform hover:scale-110"
        key={`server-${val.id}-${index}`}
      >
        <button
          onClick={async () => setActiveServer(val.id)}
          className="flex w-full h-full justify-center items-center cursor-pointer hover:brightness-90 transition  overflow-hidden box-border text-white rounded-full bg-foreground text-center"
        >
          {val.avatar_url ? (
            <img
              src={val.avatar_url}
              alt={val.name.slice(0, 1)}
              className="w-full h-full object-cover flex justify-center items-center"
            />
          ) : (
            val.name.slice(0, 1)
          )}
        </button>
      </div>
    ))
  );
};
