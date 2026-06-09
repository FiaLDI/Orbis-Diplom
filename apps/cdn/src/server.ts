import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import envConfig from "./config/env.config";
import { CDNApp } from "./app";

async function bootstrap() {
    const app = express();
    const cdnApp = new CDNApp(app, envConfig);
    await cdnApp.init();

    const useHttps =
        envConfig.NODE_ENV !== "production" && Boolean(envConfig.SSL_KEY && envConfig.SSL_CERT);

    const server = useHttps
        ? https.createServer(
              {
                  key: fs.readFileSync(envConfig.SSL_KEY!),
                  cert: fs.readFileSync(envConfig.SSL_CERT!),
              },
              app,
          )
        : http.createServer(app);

    server.listen(envConfig.PORT, envConfig.HOST, () => {
        const protocol = useHttps ? "https" : "http";
        const origin = `${protocol}://localhost:${envConfig.PORT}`;
        console.log(`CDN server started: ${origin}; frontend: ${envConfig.FRONTEND}`);
    });
}

bootstrap().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error("CDN bootstrap failed:", message);
    process.exit(1);
});
