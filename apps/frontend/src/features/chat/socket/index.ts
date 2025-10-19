import { io, Socket } from "socket.io-client";
import { config } from "@/config";

let socket: Socket | null = null;

export const initSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(`${config.monoliteUrl}/chat`, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });
    console.log("[Socket] new instance created");
  }
  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("[Socket] disconnected manually");
    socket.disconnect();
    socket = null;
  }
};
