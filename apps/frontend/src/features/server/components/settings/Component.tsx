import React from "react";
import { useAppSelector } from "@/app/hooks";
import { Component as PermissionComponent } from "./permission"

export const Component: React.FC = () => {
    const activeserver = useAppSelector((s) => s.server.activeserver);

    if (!activeserver) return null;

    return (
        <div className="flex flex-col h-full w-full p-5 rounded-[5px] lg:h-screen  text-white ">
            <div className="w-full h-full bg-[#2e3ed328]">
                <div className="p-5 bg-[#2e3ed328]">
                    Settings {activeserver?.name}
                </div>
                <div className="p-5">
                    <h4 className="text-2xl">Change name</h4>
                    <div className="flex flex-col lg:flex-row w-full gap-5">
                        <div className="w-fill flex flex-col w-[300px] p-5">
                            <div className="text-lg bg-[#2e3ed328] p-1 px-3">Current</div>
                            <div className="w-full p-2 border-b border-white">{activeserver.name}</div>
                        </div>
                       <div className="w-fill flex flex-col w-[300px] p-5">
                            <div className="text-lg bg-[#2e3ed328] p-1 px-3">New</div>
                            <div className=" w-full p-0"><input className="border-b border-white p-2 box-border w-full outline-none" type="text" /></div>
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <h4 className="text-2xl">Members</h4>
                    {activeserver?.users?.map((user,idx) => {
                        return(<div key={`member-server-${idx}`} className="flex w-full gap-5 items-center">
                            <img src={user.user_profile.avatar_url} alt="" className="shrink-0 w-[40px] h-[40px]"/>
                            {user.username} 
                            <div className="">
                            {user.user_server.map((val, index) => {
                                if (!val) return null;
                                if (!val.role) return null;
                                return (
                                <div key={`roles-${index}`} className="w-full flex gap-5 items-center" >
                                    <div className="">{val.role.name}</div>
                                    <div className="">
                                        <PermissionComponent permissions={val.role.permissions} />
                                    </div>
                                </div>
                                );
                            })}
                            </div>
                        </div>)
                    })}
                </div>
                <div className=""></div>
            </div>
        </div>
    );
};
