import fs from "fs";
import multer from "multer";
import type { Express, Request } from "express";

export type UploadServiceOptions = {
    uploadDir: string;
    maxFileSize: number;
};

export class UploadService {
    readonly middleware;

    constructor(private readonly options: UploadServiceOptions) {
        fs.mkdirSync(options.uploadDir, { recursive: true });
        this.middleware = this.createMulter().array("files", 5);
    }

    buildUploadedUrls(req: Request, files: Express.Multer.File[]) {
        const origin = `${req.protocol}://${req.get("host")}`;
        return files.map((file) => `${origin}/cdn/uploads/${file.filename}`);
    }

    private createMulter() {
        const storage = multer.diskStorage({
            destination: this.options.uploadDir,
            filename: (_req, file, cb) => {
                const safeName = file.originalname.replace(/[^a-z0-9.\-_]/gi, "_");
                cb(null, `${Date.now()}-${safeName}`);
            },
        });

        return multer({
            storage,
            limits: { fileSize: this.options.maxFileSize },
            fileFilter: (_req, file, cb) => {
                const allowed = ["image/", "video/", "audio/", "application/"];
                if (allowed.some((type) => file.mimetype.startsWith(type))) {
                    cb(null, true);
                    return;
                }

                cb(new Error("Недопустимый тип файла"));
            },
        });
    }
}
