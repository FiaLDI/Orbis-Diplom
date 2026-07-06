import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { setActiveServer } from "@/features/server/slice";
import { useLazyGetServersQuery } from "../../api";
import { useConfirm } from "@/shared/hooks/confirm/useConfirm";

export const useModerationListener = (socket: any) => {
    const dispatch = useAppDispatch();
    const [getServersUser] = useLazyGetServersQuery({});
    const { confirm, modal } = useConfirm();

    useEffect(() => {
        if (!socket) return;

        const handleKickOrBan = (event: "server_banned" | "server_kicked") => {
            return async (payload: { serverId: string; reason?: string }) => {
                console.warn(`🚨 Получено событие ${event}:`, payload);

                dispatch(setActiveServer(undefined));
                getServersUser({});
                socket.emit("leave-server", payload.serverId);

                const text =
                    event === "server_banned"
                        ? `Вы были забанены на сервере. ${
                              payload.reason ? `Причина: ${payload.reason}` : ""
                          }`
                        : "Вас выгнали с сервера.";

                await confirm(text);
            };
        };

        socket.on("server_banned", handleKickOrBan("server_banned"));
        socket.on("server_kicked", handleKickOrBan("server_kicked"));

        return () => {
            socket.off("server_banned");
            socket.off("server_kicked");
        };
    }, [socket, getServersUser, dispatch, confirm]);

    return { modal };
};
