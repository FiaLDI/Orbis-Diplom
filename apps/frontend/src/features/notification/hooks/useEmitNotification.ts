import { getNotificationSocket } from "../socket";
import { useAppSelector } from "@/app/hooks";

export function useEmitNotification() {
  const token = useAppSelector((s) => s.auth.user?.access_token);

  return (userId: number, payload: any) => {
    if (!token) return;
    const socket = getNotificationSocket(token);
    if (!socket?.connected) return;

    socket.emit("notify-user", { userId, payload });
  };
}
