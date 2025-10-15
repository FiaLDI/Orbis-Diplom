// socket.ts (отдельный файл)
import { io, Socket } from "socket.io-client";
import { config } from "@/config";

let socket: Socket | null = null;

export const getJournalSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(`${config.monoliteUrl}/journal`, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });
  }
  return socket;
};
