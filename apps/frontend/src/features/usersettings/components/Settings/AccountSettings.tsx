import { useAppSelector } from "@/app/hooks";
import React, { useState } from "react";
import { SettingsButton } from "../ui/Button";

interface activeChange{
    username?: string;
    password?: string;
    email?: string;
    number?: string;
}

const AccountSettings: React.FC = () => {
    const [activeChanged, setActiveChanged] = useState<activeChange>({});
    const user = useAppSelector(s => s.auth.user?.info);

    const changeHandler = (name: string, value: string) => {
        setActiveChanged(prev => ({
            ...prev,
            [name]: value
        }))
    }

    console.log(user)

    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-2 border-1 border-[#ffffff11] p-2">
                <div className="">
                User name:
                </div>
                <div className="p">Current: {user?.username}</div>
                <div className="p">Change: 
                    <input type="text" value={activeChanged.username} onChange={(e)=>changeHandler("username", e.target.value)}/>
                </div>

                <SettingsButton handler={()=>setActiveChanged({username: ""})}>Change</SettingsButton>
            </div>
            <div className="flex flex-col gap-2 border-1 border-[#ffffff11] p-2" >
                <div className="">
                    Password
                </div>
                <div className="">Current: ****************</div>
                <div className="p">Change: 
                    <input type="text" value={activeChanged.password} onChange={(e)=>changeHandler("password", e.target.value)}/>
                </div>
                <SettingsButton handler={()=>setActiveChanged({password: ""})}>Change</SettingsButton>
            </div>
            <div className="flex flex-col gap-2 border-1 border-[#ffffff11] p-2">
                <div className="">
                    Email
                </div>
                <div className="">Current: {user && user.email && user?.email
                        .split('.')
                        .map((val, idx) => (idx === 0 ? val.replace(/\*/g, '✱') : val))
                        .join('.')} </div>
                <div className="p">Change: 
                    <input type="text" value={activeChanged.email} onChange={(e)=>changeHandler("email", e.target.value)}/>
                </div> 
                <SettingsButton handler={()=>setActiveChanged({email: ""})}>Change</SettingsButton>
            </div>
            <div className="flex flex-col gap-2 border-1 border-[#ffffff11] p-2">
                <div className="w-40">
                    Number
                </div>
                <div className="">Current: ************</div>
                <div className="p">Change: 
                    <input type="text" value={activeChanged.number} onChange={(e)=>changeHandler("number", e.target.value)}/>
                </div> 
                <SettingsButton handler={()=>setActiveChanged({number: ""})}>Change</SettingsButton>
            
            </div>
        </div>
    );
};

export default AccountSettings;
