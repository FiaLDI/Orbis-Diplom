import { io, Socket } from "socket.io-client";
import { config } from "@/config";

let notificationSocket: Socket | null = null;

export const getNotificationSocket = (token: string): Socket => {
  if (notificationSocket && notificationSocket.connected) {
    return notificationSocket;
  }

  if (!notificationSocket) {
    console.log("🔧 Creating new /notification socket instance...");
    notificationSocket = io(`${config.monoliteUrl}/notification`, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    notificationSocket.on("connect", () => {
      console.log("✅ Connected to /notification:", notificationSocket?.id);
    });

    notificationSocket.on("connect_error", (err) => {
      console.error("❌ Notification socket connection error:", err.message);
    });

    notificationSocket.on("disconnect", (reason) => {
      console.warn("⚠️ Notification socket disconnected:", reason);
    });

    notificationSocket.on("reconnect_attempt", (n) => {
      console.log(`🔄 Trying to reconnect... attempt ${n}`);
    });
  }

  return notificationSocket;
};
