import type { Express, Request, Response } from "express";
import { MediaService } from "../services/media.service";

export function registerMediaRoutes(app: Express, service: MediaService) {
    app.get("/media/:filename", async (req: Request, res: Response) => {
        const result = await service.getMedia(req.params.filename, req.headers.range);

        if ("message" in result) {
            return res.status(result.status).send(result.message);
        }

        res.writeHead(result.status, result.headers);
        return result.stream.pipe(res);
    });
}
