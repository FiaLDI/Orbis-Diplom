import React from "react";

export const PersonalButton = ({
  setDisableServer,
  avatarUrl,
}: {
  setDisableServer: any;
  avatarUrl?: string;
}) => {
  return (
    <button onClick={() => setDisableServer()} className="cursor-pointer">
      <img
        src={avatarUrl ? avatarUrl : "/img/icon.png"}
        alt=""
        className="w-8 h-8 transition-transform hover:scale-110"
      />
    </button>
  );
};
