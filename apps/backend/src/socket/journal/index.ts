import jwt from "jsonwebtoken";
import { Socket, Namespace } from "socket.io";
import { redisClient } from "@/config";

type ServerUpdatePayload = {
  serverId: string;
  contextId?: string;
  contextType?: "project" | "issue";
};

export const journalSocket = (ioJournal: Namespace, socket: Socket) => {
  try {
    const token = socket.handshake.auth?.token;
    const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    if (decoded?.id) {
      socket.join(`user:${decoded.id}`);
      socket.data.userId = decoded.id;
    } else {
    }
  } catch (err) {
  }

  socket.on("set-status", async (userId: string, status: string) => {
    await redisClient.set(`user:${userId}:${status}`, "true");
    socket.broadcast.emit("user-online", userId);
  });

  socket.on("join-server", (serverId: string) => {
    socket.join(`server:${serverId}`);
  });

  socket.on("leave-server", (serverId: string) => {
    socket.leave(`server:${serverId}`);
  });

  socket.on("server-update", (type: string, payload: ServerUpdatePayload) => {
    const { serverId, contextId, contextType } = payload;

    if (!serverId) {
      return;
    }

    const room = `server:${serverId}`;

    const normalizedPayload: ServerUpdatePayload = {
      serverId,
      contextId,
      contextType:
        contextType ??
        (type === "issues"
          ? "project"
          : type === "issue"
          ? "issue"
          : undefined),
    };

    ioJournal.to(room).emit(`server:update:${type}`, normalizedPayload);
  });

  socket.on("disconnect", (reason: string) => {
  });
};
