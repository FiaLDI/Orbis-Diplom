import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { MenuNotification } from "@/features/notification";
import {
    CreateServerForm,
    setActiveServer,
    useGetServersQuery,
} from "@/features/server";
import { Bolt, UserRound } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Props } from "./interface";
import { setActiveChat } from "@/features/chat";

export const Component: React.FC<Props> = ({socket, notificationConnect}) => {
    const avatarUrl = useAppSelector(s => s.auth.user?.info.avatar_url);
    const {} = useGetServersQuery({});
    const dispatch = useAppDispatch();
    const navigator = useNavigate();
    const server = useAppSelector((state) => state.server);

    return (
        <>
            <div className="order-10 lg:order-0 w-full flex lg:w-fit lg:flex-col justify-between items-center lg:h-full bg-background p-3 pt-5 pb-5 relative">
                <div className="flex lg:flex-col gap-2">
                    <div className="">
                        <button
                            onClick={() => {
                                dispatch(setActiveServer(undefined));
                            }}
                            className="cursor-pointer"
                        >
                            <img src={avatarUrl ? avatarUrl : "/img/icon.png"} alt="" className="w-6 h-6 transition-transform hover:scale-110"/>
                               
                        </button>
                    </div>
                    <div className="flex gap-2 flex-col justify-center">
                        {server.servers &&
                            server.servers.map((val, index) => (
                                <div
                                    className="w-6 h-6 transition-transform hover:scale-110"
                                    key={`server-${val.id}`}
                                >
                                    <button
                                        onClick={async () => {
                                            if (
                                                server.activeserver?.id ==
                                                val.id
                                            )
                                                return;
                                            socket?.emit(
                                                "leave-server",
                                                server.activeserver?.id,
                                            );
                                            dispatch(setActiveServer(val));

                                            socket?.emit("join-server", val.id);
                                        }}
                                        className="flex justify-center items-center cursor-pointer hover:brightness-90 transition  overflow-hidden box-border text-white rounded-full bg-foreground w-full h-full text-center p-3"
                                    >
                                        {val.name.slice(0, 1)}
                                    </button>
                                </div>
                            ))}

                        <CreateServerForm />
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                        <button 
                            className=" cursor-pointer"
                            onClick={() => {
                                dispatch(setActiveChat(undefined));
                                dispatch(setActiveServer(undefined));
                            }}>
                            <UserRound
                                color="#fff"
                                strokeWidth={1.25}
                                className="w-6 h-6 transition-transform hover:scale-110" />
                            </button>
                        <MenuNotification connected={notificationConnect} />
                        <button
                            className=" cursor-pointer"
                            onClick={() => {
                                navigator("/app/settings");
                            }}
                        >
                            <Bolt 
                                color="#fff"
                                strokeWidth={1.25}
                                className="w-6 h-6 transition-transform hover:scale-110"
                            />
                        </button>
                </div>
            </div>
        </>
    );
};
