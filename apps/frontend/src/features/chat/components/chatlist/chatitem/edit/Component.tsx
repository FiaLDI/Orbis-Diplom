import React, { useEffect, useState } from "react";
import { ModalLayout } from "@/shared";
import { useUpdateChatMutation } from "@/features/chat";
import { ChatEditFormProps } from "./interface";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

export const Component: React.FC<ChatEditFormProps> = ({ initialData, onClose, onSave, editQuery, activeServerId, issueId }) => {
    const [name, setName] = useState(initialData?.name ?? "");

    const [updateChat] = useUpdateChatMutation();

    console.log(editQuery)

    const { t } = useTranslation("chat");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name ?? "");
        }
    }, [initialData]);

    const save = async () => {
        if (!name.trim()) return;

        try {
            if (editQuery) {
                if (!activeServerId) return;
                if (!issueId) return;
                editQuery({serverId: activeServerId, issueId, chatId: initialData.id, data: {
                    name,
                }, })
                
                onSave?.();
                return;
            }
            await updateChat({
                id: initialData.id,
                data: {
                    name,
                },
            }).unwrap();
            onSave?.();
        } catch (err) {
            console.error("Failed to update chat:", err);
        } finally {
            onClose();
        }
    };

    return (
        <ModalLayout open={!!initialData} onClose={onClose}>
            <div className="p-0 w-[400px] text-white ">
                <div className="bg-background w-full rounded flex items-center justify-baseline p-5">
                    <div className="w-full">{t("chat.edit.title")}</div>
                    <button
                        className="cursor-pointer p-0 w-fit"
                        onClick={() => {
                            onClose();
                        }}
                    >
                        <X />
                    </button>
                </div>

                <div className="w-full p-5 flex flex-col gap-5">
                    <div>
                        <label className="block">{t("chat.edit.form.chatname")}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded px-2 py-1 text-white bg-transparent"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="flex-1 bg-background/70 text-white py-2 rounded hover:bg-background"
                            onClick={onClose}
                        >
                            {t("chat.edit.form.cancel")}
                        </button>
                        <button
                            className="flex-1 bg-background/70 text-white py-2 rounded hover:bg-background"
                            onClick={save}
                        >
                            {t("chat.edit.form.submit")}
                        </button>
                    </div>
                </div>
            </div>
        </ModalLayout>
    );
};
