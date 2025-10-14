import { AuthenticatedSocket } from "./types/socket";

export const planningSocket = (socket: AuthenticatedSocket) => {
  console.log("📌 User connected to planning:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected from planning:", socket.id);
  });

  // события задач
  socket.on("subscribe-project", (projectId: number) => {
    socket.join(`project:${projectId}`);
    console.log(`📥 User ${socket.id} subscribed to project ${projectId}`);
  });

  socket.on("unsubscribe-project", (projectId: number) => {
    socket.leave(`project:${projectId}`);
    console.log(`📤 User ${socket.id} unsubscribed from project ${projectId}`);
  });
};
