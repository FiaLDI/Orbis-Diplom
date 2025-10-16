import React, { useEffect, useState, useRef, useCallback } from "react";
import { ModalLayout } from "@/components/layout/Modal/Modal";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
    useLazyGetUserbyNameQuery,
    useStartChattingMutation,
} from "@/features/user";
import { addAction } from "@/features/action/index";
import { ModalButton } from "@/components/ui/Button/ModalButton";
import { useSendRequestMutation } from "../..";
import { X } from "lucide-react";
import { DefaultButton } from "@/components/ui/Button/DefaultButton";

export const Component: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const [find, setFind] = useState<string>("");
    const timerRef = useRef<NodeJS.Timeout>();
    const [trigger, { data, isSuccess: isSuccessSearch }] =
        useLazyGetUserbyNameQuery();
    const myid = useAppSelector((s) => s.auth.user?.info.id);
    const [startChatting, { isSuccess: isSuccessChat, isError: isErrorChat }] =
        useStartChattingMutation();
    const [inviteFriend] = useSendRequestMutation();

    const debounce = useCallback((value: string) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            trigger(value);
        }, 500); // 500ms задержка
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFind(value);
        debounce(value);
    };

    useEffect(() => {
        if (!isSuccessChat) return;
        dispatch(
            addAction({
                id: Date.now(),
                type: "SUCCESS",
                text: "Success create chat",
                duration: 3000,
            }),
        );
    }, [isSuccessChat]);

    useEffect(() => {
        if (!isErrorChat) return;
        dispatch(
            addAction({
                id: Date.now(),
                type: "ERROR",
                text: "Error added",
                duration: 3000,
            }),
        );
    }, [isErrorChat]);

    return (
        <>
        <DefaultButton handler={() => {setOpen(true)}}>Add friend</DefaultButton>
        <ModalLayout open={open} onClose={()=>{ setOpen(false)}}>
            <div
                className=" text-white flex flex-col gap-5 w-[600px]"
            >
                <div className="bg-[#2e3ed34f] w-full rounded flex items-center justify-baseline p-5">
                    <h2 className="w-full text-2xl"> Search users </h2>
                    <button className="cursor-pointer p-0 w-fit" onClick={()=> {setOpen(false)}}><X /></button>
                </div>
                <input
                    type="text"
                    onChange={handleChange}
                    value={find}
                    placeholder="Enter name"
                    className=" box-border border-b-1 outline-0 w-full text-4xl lg:text-base"
                />
                <ul className="result">
                    <h3 className="text-5xl lg:text-2xl border-b border-b-[#ffffff3a]">
                        Results:
                    </h3>
                    {data &&
                        data.map((val: any, idx: number) => {
                            if (val.id == myid) return null;
                            return (
                                <li
                                    key={`seatch-user-${idx}`}
                                    className="flex gap-10 bg-[#4a55e9] p-3 justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={val.avatar_url}
                                            alt=""
                                            className="w-15 h-15 lg:w-10 lg:h-10"
                                        />
                                        <span className="text-3xl lg:text-base">
                                            {val.username}
                                        </span>
                                    </div>
                                    <div className="flex gap-5 ">
                                        <ModalButton
                                            handler={() =>
                                                startChatting(val.id)
                                            }
                                        >
                                            Message
                                        </ModalButton>
                                        <ModalButton
                                            handler={() => inviteFriend(val.id)}
                                        >
                                            Add friend
                                        </ModalButton>
                                    </div>
                                </li>
                            );
                        })}
                </ul>
            </div>
        </ModalLayout>
        </>
    );
};

