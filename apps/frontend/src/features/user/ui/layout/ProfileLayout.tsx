import React from "react";
import { CloseButton, HeadComponent, ModalLayout } from "@/shared";

export const ProfileLayout: React.FC<{
  userInfo: any;
  open: boolean;
  closeProfileHandler: () => void;
  Profile: React.ReactNode;
}> = ({ userInfo, open, closeProfileHandler, Profile }) => {
  if (!userInfo) return null;

  return (
    <ModalLayout onClose={closeProfileHandler} open={open}>
      <div className="text-white h-[500px] w-[600px] overflow-hidden">
        <div className="bg-foreground/20 w-full flex items-center justify-between p-2">
          <HeadComponent title={`Profile ${userInfo?.username}`} />
          <CloseButton handler={closeProfileHandler} />
        </div>
        {Profile}
      </div>
    </ModalLayout>
  );
};
