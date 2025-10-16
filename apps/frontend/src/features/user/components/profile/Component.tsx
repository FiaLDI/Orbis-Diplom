import React, { useEffect, useState, useRef } from "react";
import { ModalLayout } from "@/components/layout/Modal/Modal";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { closeProfile } from "../../slice";
import { X } from "lucide-react";

export const Component: React.FC = () => {
    const [infoStage, setInfoStage] = useState<number>(0);
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((s) => s.user.openProfile);
    const check = useAppSelector((s) => s.user.isOpenProfile);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(()=> {
        if (check) {
            setOpen(true)
        }
    }, [check])

    if (!check) return null;

    return (
        <ModalLayout onClose={()=> {dispatch(closeProfile());setOpen(prev => !prev)}} open={open}>
            <div className="p-5 text-white h-[600px] w-[600px] overflow-hidden">
                <div className="bg-[#2e3ed34f] w-full rounded flex items-center justify-baseline p-5">
                    <div className="w-full">Profile {userInfo?.username}</div>
                    <button className="cursor-pointer p-0 w-fit" onClick={()=> {dispatch(closeProfile());setOpen(prev => !prev)}}><X /></button>
                </div>
                <div className="p-5"></div>
                <div className="flex  w-full flex-col gap-10">
                    <div className="flex items-end gap-5 text-base">
                        <div className="">
                            <img className="h-15 w-15 shrink-0 rounded-2xl" src={(userInfo && userInfo.avatar_url) ? userInfo?.avatar_url : "/img/icon.png"} />
                            <span></span>
                        </div>
                        <div className="truncate ">{userInfo?.username}</div>
                    </div>
                    <div className="flex justify-between gap-10">
                        <button
                            data-active={infoStage === 0}
                            className={"px-5 py-2 bg-[#4453f476] data-[active]:bg-[#afb3e7be]" }
                            onClick={() => setInfoStage(0)}
                        >
                            About
                        </button>
                    </div>
                </div>
                <div className="p-5  w-full ">
                    {infoStage === 0 && <div>{userInfo && userInfo?.about}</div>}
                    
                </div>
            </div>
        </ModalLayout>
    );
};

