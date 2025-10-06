import React from "react";
import { useAppSelector } from "@/app/hooks";
import { useLazyGetInfoUserQuery } from "@/features/user";

export const MemberChatServer: React.FC = () => {
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
            <div className="bg-[rgba(81,110,204,0.12)] text-white p-4 flex flex-col w-[200px] lg:w-[400px]">
                <h2 className="p-2 pt-1 pb-5 whitespace-nowrap">Участники: {users?.length}</h2>
                <ul className=" flex flex-col gap-5  h-full p-2">
                    {users?.map((val: any, idx: number) => (
                        <li className="h-fit bg-[#2e3ed34f] p-2">
                            <button
                                className="flex items-center gap-5 truncate"
                                key={`${idx}-member-server`}
                                onClick={() => handleClick(val.id)}
                            >
                                <img
                                    src="/img/icon.png"
                                    alt=""
                                    className="w-10 h-10"
                                />
                                {val.username}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};
