import "dotenv/config";
import http from "http";
import { ENVCONFIG, connectRedis } from "@/config";
import { app } from "./app";
import { initSockets } from "./socket";
import cors from "cors";

connectRedis();

const server = http.createServer(app);

initSockets(server);

const PORT = Number(ENVCONFIG.PORT ?? 4000);
const HOST = "0.0.0.0";

console.log("✅ PROD MODE HTTP, PID:", process.pid);

server.listen(PORT, HOST, () => {
    console.log(`✅ HTTP Prod server running on port ${PORT}`);
    console.log(`🌍 Frontend origin: ${ENVCONFIG.FRONTENDADDRES}`);
});
