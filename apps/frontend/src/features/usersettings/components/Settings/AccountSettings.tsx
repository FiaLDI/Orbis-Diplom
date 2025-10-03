import { useAppSelector } from "@/app/hooks";
import React, { useState } from "react";
import { SettingsButton } from "../ui/Button";

interface activeChange {
    username?: string;
    password?: string;
    email?: string;
    number?: string;
}

const AccountSettings: React.FC = () => {
    const [activeChanged, setActiveChanged] = useState<activeChange>({});
    const user = useAppSelector((s) => s.auth.user?.info);

    const changeHandler = (name: string, value: string) => {
        setActiveChanged((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="flex gap-5 flex-wrap ">
            <div className="flex flex-col gap-1 border-1 border-[#ffffff11] w-[300px]">
                <div className="bg-[#ffffff11] p-2">User name</div>
                <div className="flex flex-col w-full gap-2 p-2">
                    <div className="">{user?.username}</div>
                    <div className="">
                    <input
                        type="text"
                        value={activeChanged.username}
                        onChange={(e) =>
                            changeHandler("username", e.target.value)
                        }
                        className="w-full rounded-none focus:outline-none focus-visible:outline-none border-b border-[#ffffff11] focus-visible:border-[#ffffff]"
                        placeholder="Enter new username"
                    
                    />
                </div>
                </div>
                
            </div>
            <div className="flex flex-col gap-1 border-1 border-[#ffffff11] w-[300px]">
                <div className="bg-[#ffffff11] p-2">Password</div>
                <div className="flex flex-col w-full gap-2 p-2">
                <div className="">****************</div>
                <div className="p">
                    <input
                        type="text"
                        value={activeChanged.password}
                        onChange={(e) =>
                            changeHandler("password", e.target.value)
                        }
                        className="w-full rounded-none focus:outline-none focus-visible:outline-none border-b border-[#ffffff11] focus-visible:border-[#ffffff]"
                        placeholder="Enter new password"
                    
                    />
                </div>
                </div>
            </div>
            <div className="flex flex-col gap-1 border-1 border-[#ffffff11] w-[300px]">
                <div className="bg-[#ffffff11] p-2">Email</div>
                <div className="flex flex-col w-full gap-2 p-2">
                <div className="">
                    {user &&
                        user.email &&
                        user?.email
                            .split(".")
                            .map((val, idx) =>
                                idx === 0 ? val.replace(/\*/g, "✱") : val,
                            )
                            .join(".")}{" "}
                </div>
                <div className="p">
                    <input
                        type="text"
                        value={activeChanged.email}
                        onChange={(e) => changeHandler("email", e.target.value)}
                        className="w-full rounded-none focus:outline-none focus-visible:outline-none border-b border-[#ffffff11] focus-visible:border-[#ffffff]"
                        placeholder="Enter new email"
                    
                    />
                </div>
                </div>
            </div>
            <div className="flex flex-col gap-1 border-1 border-[#ffffff11] w-[300px]">
                <div className="bg-[#ffffff11] p-2">Number</div>
                <div className="flex flex-col w-full gap-2 p-2">
                <div className="">************</div>
                <div className="p">
                    <input
                        type="text"
                        value={activeChanged.number}
                        onChange={(e) =>
                            changeHandler("number", e.target.value)
                        }
                        className="w-full rounded-none focus:outline-none focus-visible:outline-none border-b border-[#ffffff11] focus-visible:border-[#ffffff]"
                        placeholder="Enter new number"
                    />
                </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
