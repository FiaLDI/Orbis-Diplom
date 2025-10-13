import React from "react";
import { useAppSelector } from "@/app/hooks";
import { useLazyGetInfoUserQuery } from "@/features/user";

export const Component: React.FC = () => {
    const membersServer = useAppSelector((s) => s.server.activeserver?.users);
    const activeserver = useAppSelector((s) => s.server.activeserver?.id);
    const chatinfo = useAppSelector((s) => s.chat.activeChat);

    const [trigger] = useLazyGetInfoUserQuery();

    if (!membersServer && !chatinfo?.users) return null;

    const users = activeserver ? membersServer : chatinfo?.users;
    const handleClick = (id: number) => {
        trigger(id);
    };

    return (
        <>
            <div className="bg-[rgba(81,110,204,0.12)] text-white  text-lg flex flex-col w-[200px] lg:w-[400px] lg:min-w-[250px] lg:max-w-[250px]">
                <h2 className=" whitespace-nowrap bg-[rgb(81,110,204)] p-5 ">Участники: {users?.length}</h2>
                <ul className=" flex flex-col gap-3  h-full p-3">
                    {users?.map((val: any, idx: number) => (
                        <li key={`user-server-${idx}`} className="h-fit bg-[#2e3ed34f] p-2 rounded-[10px]">
                            <button
                                className="flex items-center gap-3 w-full"
                                key={`${idx}-member-server`}
                                onClick={() => handleClick(val.id)}
                            >
                                <div className=" shrink-0">
                                    <img
                                    src="/img/icon.png"
                                    alt=""
                                    className="w-6 h-6"
                                />
                                </div>
                                
                                <div className="truncate text-left w-full">  
                                    {val.username}
                                </div>
                                
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};
