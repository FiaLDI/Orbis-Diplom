import React from "react";

export const ProfileView: React.FC<{ userInfo: any }> = ({ userInfo }) => {
  if (!userInfo) return null;
  return (
    <>
      <div className="flex p-5 w-full flex-col gap-10">
        <div className="flex h-full w-full items-end gap-5 text-base">
          <div className="h-16 w-16">
            <img
              className="h-full w-full shrink-0 rounded-2xl"
              src={
                userInfo && userInfo.avatar_url
                  ? userInfo?.avatar_url
                  : "/img/icon.png"
              }
            />
            <span></span>
          </div>
          <div className="truncate ">{userInfo?.username}</div>
        </div>
        <div className="flex justify-between gap-10">
          <button
            className={"px-5 py-2 bg-foreground/70 data-[active]:bg-background"}
          >
            About
          </button>
        </div>
      </div>
      <div className="p-5  w-full ">
        <div>Birth year: {new Date(`${userInfo?.birth_date}`).getFullYear()}</div>
        <div>{userInfo?.number}</div>
        <div>{userInfo?.about}</div>
      </div>
    </>
  );
};
