import { useEffect, useState } from "react";
import {
  initSocket,
  getSocket,
  disconnectSocket,
} from "@/features/chat/socket";
import { useAppSelector } from "@/app/hooks";
import type { Socket } from "socket.io-client";

export const useChatSocket = () => {
  const token = useAppSelector((s) => s.auth.user?.access_token);
  const [socket, setSocket] = useState<Socket | null>(getSocket());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    let s = getSocket();
    if (!s) {
      s = initSocket(token);
    }
    setSocket(s);

    const handleConnect = () => {
      console.log("[Socket] Connected");
      setIsConnected(true);
    };
    const handleDisconnect = () => {
      console.log("[Socket] Disconnected");
      setIsConnected(false);
    };
    const handleError = (err: any) => {
      console.error("[Socket] Error:", err);
      setIsConnected(false);
    };

    s.on("connect", handleConnect);
    s.on("disconnect", handleDisconnect);
    s.on("connect_error", handleError);

    return () => {
      s?.off("connect", handleConnect);
      s?.off("disconnect", handleDisconnect);
      s?.off("connect_error", handleError);
    };
  }, [token]);

  return { socket, isConnected, disconnectSocket };
};
