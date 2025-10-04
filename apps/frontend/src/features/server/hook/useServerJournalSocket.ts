import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "@/config";
import { useAppSelector } from "@/app/hooks";

export const useServerJournalSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    
    const token = useAppSelector(s => s.auth.user?.access_token);

    useEffect(() => {
        if (!token) return;

        if (!socketRef.current) {
            const newSocket = io(`${config.monoliteUrl}/journal`, {
                auth: { token: token },
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 3000,
            });

            newSocket.on("connect", () => {
                console.log("[JournalSocket] Connected");
                setIsConnected(true);
            });

            newSocket.on("disconnect", () => {
                console.log("[JournalSocket] Disconnected");
                setIsConnected(false);
            });

            newSocket.on("connect_error", (err) => {
                console.error("[JournalSocket] Connection error:", err);
                setIsConnected(false);
            });

            socketRef.current = newSocket;
        }
    }, [token]);

    return {
        socket: socketRef.current,
        isConnected,
    };
};
