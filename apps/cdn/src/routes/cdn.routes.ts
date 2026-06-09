import type { Express, Request, Response } from "express";
import { CdnFileService } from "../services/cdn-file.service";

export function registerCdnRoutes(app: Express, service: CdnFileService) {
    app.get("/cdn/:folder?/:filename", async (req: Request, res: Response) => {
        const folder = req.params.folder || "";
        const filename = req.params.filename || "";

        const result = await service.getFile(folder, filename);
        if (!result) {
            return res.status(404).send("Файл не найден");
        }

        res.setHeader("Content-Type", result.contentType);
        res.setHeader("Content-Length", result.contentLength);
        res.setHeader("Cache-Control", result.cacheControl);
        return res.send(result.buffer);
    });
}
