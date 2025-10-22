import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { setActiveServer } from "@/features/server/slice";

export const useModerationListener = (socket: any) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) return;

        const handleKickOrBan = (event: "server_banned" | "server_kicked") => {
            return (payload: { serverId: number; reason?: string }) => {
                console.warn(`🚨 Получено событие ${event}:`, payload);

                dispatch(setActiveServer(undefined));

                const text =
                    event === "server_banned"
                        ? `Вы были забанены на сервере. ${
                              payload.reason ? `Причина: ${payload.reason}` : ""
                          }`
                        : "Вас выгнали с сервера.";

                navigate("/servers", { replace: true });

                socket.emit("leave-server", payload.serverId);
            };
        };

        socket.on("server_banned", handleKickOrBan("server_banned"));
        socket.on("server_kicked", handleKickOrBan("server_kicked"));

        return () => {
            socket.off("server_banned");
            socket.off("server_kicked");
        };
    }, [socket, dispatch, navigate]);
};
