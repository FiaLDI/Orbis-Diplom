import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import https from "https";
import { connectRedis } from "./config";
import { authRoutes } from "./modules/auth";
import { userRouter } from "./modules/users";
import { Server } from "socket.io";

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
app.use("/api", authRoutes);
app.use("/api", userRouter);

const server = https.createServer(options, app);

export const ioJournal = new Server(server, {
    cors: {
        origin: process.env.FRONTENDADDRES,
    },
});

export const ioChat = new Server(server, {
    cors: {
        origin: process.env.FRONTENDADDRES,
    },
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server for frontend: ${process.env.FRONTENDADDRES}`);
});
