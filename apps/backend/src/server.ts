import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import https from "https";
import { connectRedis } from "./config";
import { authRoutes, chatRouter, moderationRouter, notificationRouter, planningRouter, rolesRouter, searchRouter } from "@/modules";
import { userRouter } from "@/modules";
import { Server } from "socket.io";
import { AuthenticatedSocket, chatSocket, journalSocket, planningSocket, notificationSocket } from "./socket";
import { messagesRouter } from "@/modules";
import { friendRouter } from "@/modules";
import { serverRouter } from "@/modules";

dotenv.config();

if (!process.env.PORT && !process.env.FRONTENDADDRES) {
    console.error(
        `Need PORT(${process.env.PORT}) FRONTENDADDRES${process.env.FRONTENDADDRES}`,
    );
    process.exit(0);
}
connectRedis();
const app = express();

const options = {
    key: fs.readFileSync("./src/certs/selfsigned_key.pem"),
    cert: fs.readFileSync("./src/certs/selfsigned.pem"),
};

app.use(
    cors({
        origin: process.env.FRONTENDADDRES,
        credentials: true,
    }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRouter);
app.use("/api/friends", friendRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/moderation", moderationRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/servers", rolesRouter);
app.use("/api/search", searchRouter);
app.use("/api/servers", serverRouter);
app.use("/api/users", userRouter);
app.use("/api/servers", planningRouter)

const server = https.createServer(options, app);

export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTENDADDRES,
    },
})

export const ioJournal = io.of("/journal");

ioJournal.on("connection", (socket) => {
    journalSocket(socket as AuthenticatedSocket)
})

export const ioChat = io.of("/chat");

ioChat.on("connection", (socket) => {
    chatSocket(socket as AuthenticatedSocket)
})

export const ioPlanning = io.of("/planning");

ioPlanning.on("connection", (socket) => {
  planningSocket(socket as AuthenticatedSocket);
});

export const ioNotification = io.of("/notification");

ioNotification.on("connection", (socket) => {
  notificationSocket(socket as AuthenticatedSocket);

  
});

const PORT = Number(process.env.PORT);
const HOST = "0.0.0.0";
server.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server for frontend: ${process.env.FRONTENDADDRES}`);
});
