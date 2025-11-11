import React from "react";
import { usePublicProfileModel } from "../../model/usePublicProfileModel";
import { ProfileLayout } from "../../ui/Layout/ProfileLayout";
import { ProfileView } from "../../ui/view/Profile";

export const Component: React.FC = () => {
    const {
        userInfo,
        open,
        closeProfileHandler,
    } = usePublicProfileModel();

    if (!userInfo) return null;

    return (
        <ProfileLayout
            userInfo={userInfo}
            open={open}
            closeProfileHandler={closeProfileHandler}
            Profile={<ProfileView userInfo={userInfo}/>}
        />
    );
};
