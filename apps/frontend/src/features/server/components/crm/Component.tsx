import React, { useEffect, useState } from "react";
import { ModalLayout } from "@/shared";
import {
    useCreateSeverMutation,
    useJoinServerMutation,
    useLazyGetServersQuery,
} from "@/features/server";
import { ModalButton } from "@/shared/ui";
import { ModalInput } from "@/shared/ui";
import { CirclePlus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Component: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [createServer, { isSuccess: successCreate }] = useCreateSeverMutation();
    const [joinServer, { isSuccess: successJoin }] = useJoinServerMutation();
    const [nameServer, setNameServer] = useState<string>();
    const [idServer, setIdServer] = useState<string>();
    const [trigger] = useLazyGetServersQuery();

    const { t } = useTranslation("server");

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
            setOpen(false);
        } catch (err) {
            console.log(err);
            setOpen(false);
        }
    };

    const joinServerHandler = async () => {
        if (!idServer) return;
        try {
            await joinServer(Number(idServer));
            setOpen(false);
        } catch (err) {
            console.log(err);
            setOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => {
                    setOpen(true);
                }}
                className="cursor-pointer"
            >
                <CirclePlus
                    color="#fff"
                    strokeWidth={1.25}
                    className="w-8 h-8 transition-transform hover:scale-110"
                />
            </button>
            <ModalLayout
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            >
                <div className="p-0 text-white flex flex-col w-[300px]">
                    <div className="bg-background w-full rounded flex items-center justify-baseline p-5">
                        <h2 className="w-full text-2xl">{t("form.title")}</h2>
                        <button
                            className="cursor-pointer p-0 w-fit"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <X />
                        </button>
                    </div>
                    <div className="w-full flex flex-col p-5 gap-5 items-center">
                        <div className="w-full flex flex-col gap-5 items-end">
                            <ModalInput
                                placeHolder={t("form.createplaceholder")}
                                name="servername"
                                value={nameServer || ""}
                                change={(e) => setNameServer((e.target as HTMLInputElement).value)}
                            />
                            <ModalButton handler={() => createrServerHandler()}>
                                {t("form.create")}
                            </ModalButton>
                        </div>
                        <div className="w-full flex flex-col gap-5 items-end">
                            <ModalInput
                                placeHolder={t("form.connectplaceholder")}
                                name="serverid"
                                value={idServer || ""}
                                change={(e) => {
                                    setIdServer((e.target as HTMLInputElement).value);
                                }}
                            />
                            <ModalButton handler={() => joinServerHandler()}>
                                {t("form.connect")}
                            </ModalButton>
                        </div>
                    </div>
                </div>
            </ModalLayout>
        </>
    );
};
