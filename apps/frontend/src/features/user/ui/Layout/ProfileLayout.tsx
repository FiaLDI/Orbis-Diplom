import React from "react";
import { ModalLayout } from "@/shared";
import { X } from "lucide-react";

export const ProfileLayout: React.FC<{userInfo: any, open: boolean, closeProfileHandler: () => void, Profile: React.ReactNode}> = ({userInfo, open, closeProfileHandler, Profile}) => {

    if (!userInfo) return null;

    return (
        <ModalLayout
            onClose={closeProfileHandler}
            open={open}
        >
            <div className="text-white h-[600px] w-[600px] overflow-hidden">
                <div className="bg-background w-full rounded flex items-center justify-baseline p-5">
                    <div className="w-full">Profile {userInfo?.username}</div>
                    <button
                        className="cursor-pointer p-0 w-fit"
                        onClick={closeProfileHandler}
                    >
                        <X />
                    </button>
                </div>
                {Profile}
            </div>
        </ModalLayout>
    );
};
