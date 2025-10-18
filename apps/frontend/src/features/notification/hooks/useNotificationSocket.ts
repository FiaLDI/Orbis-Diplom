import { useEffect, useState } from "react";
import { getNotificationSocket } from "../socket";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  addNotification,
  userOnline,
  userOffline,
} from "../slice";

export const useNotificationSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const token = useAppSelector((s) => s.auth.user?.access_token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) return;

    const socket = getNotificationSocket(token);

    const handleConnect = () => {
      console.log("[Socket] Connected to /notification");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("[Socket] Disconnected from /notification");
      setIsConnected(false);
    };

    const handleNotification = (notif: any) => {
      console.log("🔔 New notification:", notif);
      dispatch(addNotification(notif));
    };

    const handleUserOnline = ({ userId }: { userId: number }) => {
      console.log("🟢 User online:", userId);
      dispatch(userOnline(userId));
    };

    const handleUserOffline = ({ userId }: { userId: number }) => {
      console.log("🔴 User offline:", userId);
      dispatch(userOffline(userId));
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("notification", handleNotification);
    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);

    // ♻️ TTL-пинг каждые 30 секунд
    const pingInterval = setInterval(() => {
      if (socket.connected) socket.emit("ping-online");
    }, 30_000);

    return () => {
      // ⚠️ ВАЖНО: НЕ вызываем socket.disconnect()!
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
