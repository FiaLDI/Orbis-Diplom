import React, { useEffect, useState } from "react";
import { ModalLayout } from "@/components/layout/Modal/Modal";
import {
    useCreateSeverMutation,
    useJoinServerMutation,
    useLazyGetServersQuery,
} from "@/features/server";
import { ModalButton } from "@/components/ui/Button/ModalButton";
import { ModalInput } from "@/components/ui/Input/ModalInput";
import { CirclePlus, X } from "lucide-react";

export const Component: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [createServer, { isSuccess: successCreate }] =
        useCreateSeverMutation();
    const [joinServer, { isSuccess: successJoin }] = useJoinServerMutation();
    const [nameServer, setNameServer] = useState<string>();
    const [idServer, setIdServer] = useState<string>();
    const [trigger] = useLazyGetServersQuery();

    useEffect(() => {
        trigger({});
    }, [successCreate, successJoin]);

    const createrServerHandler = async () => {
        if (!nameServer) return;
        if (nameServer?.length < 6) return;
        try {
            const newServer = {
                name: nameServer,
            };
            await createServer(newServer);
        } catch (err) {
            console.log(err);
        } 
    };

    const joinServerHandler = async () => {
        if (!idServer) return;
        try {
            await joinServer(idServer);
        } catch (err) {
            console.log(err);
        } 
    };


    return (
        <>
        <button
            onClick={() => {setOpen(true)}}
            className="cursor-pointer"
        >
            <CirclePlus
                color="#fff"
                strokeWidth={1.25}
                className="w-15 h-15 lg:w-10 lg:h-10"
            />
        </button>
        <ModalLayout open={open} onClose={()=>{setOpen(false)}}>
            <div
                className="p-0 text-white flex flex-col gap-3 w-[600px]"
            >
                <div className="bg-[#2e3ed34f] w-full rounded flex items-center justify-baseline p-5">
                    <h2 className="w-full text-2xl"> Search users </h2>
                    <button className="cursor-pointer p-0 w-fit" onClick={()=> {setOpen(false)}}><X /></button>
                </div>
                <ModalInput
                    placeHolder="Enter server name"
                    name="servername"
                    value={nameServer || ""}
                    change={(e) =>
                        setNameServer((e.target as HTMLInputElement).value)
                    }
                />
                <ModalButton handler={() => createrServerHandler()}>
                    Create
                </ModalButton>
                <p>You can also join by id</p>
                <ModalInput
                    placeHolder="Enter server id"
                    name="serverid"
                    value={idServer || ""}
                    change={(e) => {
                        setIdServer((e.target as HTMLInputElement).value);
                    }}
                />
                <ModalButton handler={() => joinServerHandler()}>
                    Connect
                </ModalButton>
            </div>
        </ModalLayout>
        </>
    );
};
