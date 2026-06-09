import type { Express, Request, Response } from "express";
import { UploadService } from "../services/upload.service";

export function registerUploadRoutes(app: Express, service: UploadService) {
    app.post("/upload", service.middleware, (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "Нет загруженных файлов" });
        }

        const urls = service.buildUploadedUrls(req, files);
        return res.status(200).json({ uploaded: urls });
    });
}
