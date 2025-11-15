import { useEffect, useState } from "react";
import { getNotificationSocket } from "@/features/notification/socket";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  addNotification,
  userOnline,
  userOffline,
} from "@/features/notification/slice";

export const useNotificationSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const token = useAppSelector((s) => s.auth.user?.access_token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) return;

    const socket = getNotificationSocket(token);

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleNotification = (notif: any) => {
      dispatch(addNotification(notif));
    };

    const handleUserOnline = ({ userId }: { userId: string }) => {
      dispatch(userOnline(userId));
    };

    const handleUserOffline = ({ userId }: { userId: string }) => {
      dispatch(userOffline(userId));
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("notification", handleNotification);
    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);

    const pingInterval = setInterval(() => {
      if (socket.connected) socket.emit("ping-online");
    }, 30_000);

    return () => {
      clearInterval(pingInterval);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("notification", handleNotification);
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
    };
  }, [token, dispatch]);

  return { isConnected };
};
