import fs from "fs";
import path from "path";
import { getMimeType } from "../utils/mime";

export type MediaStreamResult =
    | {
          status: 200;
          headers: Record<string, string | number>;
          stream: fs.ReadStream;
      }
    | {
          status: 206;
          headers: Record<string, string | number>;
          stream: fs.ReadStream;
      }
    | {
          status: 404 | 416;
          message: string;
      };

export class MediaService {
    constructor(private readonly publicDir: string) {}

    async getMedia(filename: string, range?: string): Promise<MediaStreamResult> {
        const filePath = path.join(this.publicDir, filename);
        const stats = await this.getStats(filePath);

        if (!stats?.isFile()) {
            return { status: 404, message: "Not found" };
        }

        if (!range) {
            return {
                status: 200,
                headers: {
                    "Content-Length": stats.size,
                    "Content-Type": getMimeType(filePath),
                },
                stream: fs.createReadStream(filePath),
            };
        }

        const parsedRange = this.parseRange(range, stats.size);
        if (!parsedRange) {
            return { status: 416, message: "Requested range not satisfiable" };
        }

        const { start, end } = parsedRange;

        return {
            status: 206,
            headers: {
                "Content-Range": `bytes ${start}-${end}/${stats.size}`,
                "Accept-Ranges": "bytes",
                "Content-Length": end - start + 1,
                "Content-Type": getMimeType(filePath),
            },
            stream: fs.createReadStream(filePath, { start, end }),
        };
    }

    private async getStats(filePath: string) {
        try {
            return await fs.promises.stat(filePath);
        } catch {
            return null;
        }
    }

    private parseRange(range: string, fileSize: number) {
        const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

        if (Number.isNaN(start) || start >= fileSize || end >= fileSize || start > end) {
            return null;
        }

        return { start, end };
    }
}
