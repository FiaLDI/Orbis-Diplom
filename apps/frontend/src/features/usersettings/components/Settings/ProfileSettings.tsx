import React, { useState } from "react";
import { SettingsButton } from "../ui/Button";
import { useAppSelector } from "@/app/hooks";

interface activeChange {
    username?: string;
    about?: string;
}

const ProfileSettings: React.FC = () => {
    const [activeChanged, setActiveChanged] = useState<activeChange>({});
    const user = useAppSelector((s) => s.auth.user?.info);

    const changeHandler = (name: string, value: string) => {
        setActiveChanged((prev) => ({
            ...prev,
            [name]: value,
        }));
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
                <div className="bg-[#ffffff11] p-2">Display name</div>
                <div className="">{user?.username}</div>
                <input
                    type="text"
                    value={activeChanged.username}
                        onChange={(e) =>
                            changeHandler("username", e.target.value)
                        }
                    className="w-full rounded-none focus:outline-none focus-visible:outline-none border-b border-[#ffffff11] focus-visible:border-[#ffffff]"
                    placeholder="Enter new display name"
                    
                />
            </div>
            
            <div className="flex flex-col gap-1 border-1 border-[#ffffff11] w-[300px]">
                <div className="bg-[#ffffff11] p-2">About me</div>
                <div className="">{user?.birthDate}</div>
                <textarea className="border-b-1 contain-size w-full h-full focus-visible:outline-none" value={activeChanged.about}
                        onChange={(e) =>
                            changeHandler("about", e.target.value)
                        }></textarea>
            </div>
        </div>
    );
};

export default ProfileSettings;
