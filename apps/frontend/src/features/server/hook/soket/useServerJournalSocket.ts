import { useEffect, useState } from "react";
import { getJournalSocket } from "../../socket";
import { useAppSelector } from "@/app/hooks";

export const useServerJournalSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const token = useAppSelector((s) => s.auth.user?.access_token);

  useEffect(() => {
    if (!token) return;
    const socket = getJournalSocket(token);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [token]);

  return { socket: token ? getJournalSocket(token) : null, isConnected };
};
