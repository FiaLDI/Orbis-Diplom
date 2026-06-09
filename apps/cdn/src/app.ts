import type { Express, Request, Response } from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import serveStatic from "serve-static";
import path from "path";
import type { CDNConfig } from "./config/env.config";
import { connectRedis, redisClient } from "./config";
import { registerCdnRoutes } from "./routes/cdn.routes";
import { registerDownloadRoutes } from "./routes/download.routes";
import { registerMediaRoutes } from "./routes/media.routes";
import { registerUploadRoutes } from "./routes/upload.routes";
import { CdnFileService } from "./services/cdn-file.service";
import { DownloadService } from "./services/download.service";
import { MediaService } from "./services/media.service";
import { UploadService } from "./services/upload.service";

export class CDNApp {
    constructor(
        private readonly app: Express,
        private readonly config: CDNConfig,
        private readonly publicDir = path.resolve("public"),
    ) {}

    async init() {
        await connectRedis();

        this.app.set("trust proxy", true);
        this.app.use(
            cors({
                origin: this.config.FRONTEND,
                credentials: true,
            }),
        );
        this.app.use(morgan("combined"));
        this.app.use(compression());

        const cdnFileService = new CdnFileService(this.publicDir, redisClient);
        const mediaService = new MediaService(this.publicDir);
        const downloadService = new DownloadService();
        const uploadService = new UploadService({
            uploadDir: this.config.UPLOAD_DIR,
            maxFileSize: this.config.MAX_FILE_SIZE,
        });

        registerCdnRoutes(this.app, cdnFileService);
        registerMediaRoutes(this.app, mediaService);
        registerDownloadRoutes(this.app, downloadService);
        registerUploadRoutes(this.app, uploadService);

        this.app.use(
            "/",
            serveStatic(this.publicDir, {
                maxAge: "1d",
                etag: true,
            }),
        );

        this.app.use((_req: Request, res: Response) => {
            res.status(404).send("Файл не найден");
        });
    }
}
