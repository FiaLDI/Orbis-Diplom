import "dotenv/config";
import fs from "fs";
import https from "https";
import { ENVCONFIG, connectRedis } from "@/config";
import { app } from "./app";
import { initSockets } from "./socket";

const options = {
    key: fs.readFileSync("./src/certs/selfsigned_key.pem"),
    cert: fs.readFileSync("./src/certs/selfsigned.pem"),
};

connectRedis();

const server = https.createServer(options, app);

initSockets(server);

const PORT = Number(ENVCONFIG.PORT ?? 4000);
const HOST = "0.0.0.0";

console.log("✅ DEV MODE HTTPS, PID:", process.pid);

server.listen(PORT, HOST, () => {
    console.log(`✅ HTTPS Dev server running on https://localhost:${PORT}`);
    console.log(`🌍 Frontend origin: ${ENVCONFIG.FRONTENDADDRES}`);
});
