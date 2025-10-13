import React, { useState } from "react";
import { SettingsButton } from "./ui/Button";
import { useUpdateAccountMutation } from "../api";
import {Component as ChangeModal} from "./overall"
import { useAppSelector } from "@/app/hooks";

const SettingsController: React.FC = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const settings = useAppSelector((s) => s.settings);

    const isProfileChange = settings.profileInfoUpdated ? Object.keys(settings.profileInfoUpdated).length : 0;
    const isAccountChange = settings.accountInfoUpdated ? Object.keys(settings.accountInfoUpdated).length : 0;

    return (
        <>
         <ChangeModal onClose={()=>setIsOpen(false)} open={isOpen}/>
        <div className="fixed right-5 bottom-5">
            <SettingsButton
                handler={() => setIsOpen(prev => !prev)}
                disabled={Boolean(!(isProfileChange || isAccountChange))}
            >
                Change
            </SettingsButton>
        </div></>
    )
}


export default SettingsController;