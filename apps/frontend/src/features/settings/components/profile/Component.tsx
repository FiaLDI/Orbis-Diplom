import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { activeChange } from "./interface";
import {  setProfileInfo } from "../../settingsSlice";


export const Component: React.FC = () => {
    const user = useAppSelector((s) => s.auth.user?.info);
    const settings = useAppSelector((s) => s.settings);
    const dispatch = useAppDispatch();

    const changeHandler = (name: string, value: string) => {
        dispatch(setProfileInfo({
            [name]: value
        }))
    };

    return (
        <div className="flex gap-5 flex-wrap">
            <div className="flex flex-col gap-1 border-1 border-[#ffffff11] w-[300px]">
                <div className="bg-[#ffffff11] p-2">Avatar</div>
                <div className="flex">
                    <img src={user?.avatar_url} alt="" />
                    <button>Изменить</button>
                </div>
            </div>
            
            <div className="flex flex-col gap-1 border-1 border-[#ffffff11] w-[300px]">
                <div className="bg-[#ffffff11] p-2">About me</div>
                <div className="">{user?.birthDate}</div>
                <textarea className="border-b-1 contain-size w-full h-full focus-visible:outline-none" value={settings.profileInfoUpdated?.about}
                        onChange={(e) =>
                            changeHandler("about", e.target.value)
                        }></textarea>
            </div>
        </div>
    );
};

