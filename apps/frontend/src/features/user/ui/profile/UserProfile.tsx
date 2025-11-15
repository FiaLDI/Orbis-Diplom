import React from "react";
import { usePublicProfileModel } from "../../hooks";
import { ProfileView } from "../view/Profile";
import { ProfileLayout } from "../layout/ProfileLayout";

export const UserProfile: React.FC = () => {
  const { userInfo, open, closeProfileHandler } = usePublicProfileModel();

  if (!userInfo) return null;

  return (
    <ProfileLayout
      userInfo={userInfo}
      open={open}
      closeProfileHandler={closeProfileHandler}
      Profile={<ProfileView userInfo={userInfo} />}
    />
  );
};
