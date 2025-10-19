import "dotenv/config";
import fs from "fs";
import https from "https";
import { ENVCONFIG, connectRedis } from "@/config";
import { app } from "./app";
import { initSockets } from "./socket";

if (!ENVCONFIG.PORT || !ENVCONFIG.FRONTENDADDRES) {
  console.error(`❌ Need PORT(${ENVCONFIG.PORT}) and FRONTENDADDRES(${ENVCONFIG.FRONTENDADDRES})`);
  process.exit(1);
}

connectRedis();

const options = {
  key: fs.readFileSync("./src/certs/selfsigned_key.pem"),
  cert: fs.readFileSync("./src/certs/selfsigned.pem"),
};

const server = https.createServer(options, app);

initSockets(server);

const PORT = Number(ENVCONFIG.PORT);
const HOST = "0.0.0.0";

server.listen(PORT, HOST, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌍 Frontend origin: ${ENVCONFIG.FRONTENDADDRES}`);
});
