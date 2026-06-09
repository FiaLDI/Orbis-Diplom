import type { Express, Request, Response } from "express";
import { DownloadService } from "../services/download.service";

export function registerDownloadRoutes(app: Express, service: DownloadService) {
    app.get("/download", async (req: Request, res: Response) => {
        const fileUrl = req.query.url as string;
        if (!fileUrl) return res.status(400).send("Missing URL");

        try {
            const result = await service.fetch(fileUrl);
            res.setHeader("Content-Disposition", `attachment; filename="${result.filename}"`);
            return result.stream.pipe(res);
        } catch {
            return res.status(500).send("Ошибка загрузки");
        }
    });
}
