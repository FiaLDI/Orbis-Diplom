import fs from "fs";
import path from "path";
import type { CacheClient } from "../types/cache";
import { getMimeType } from "../utils/mime";

export type CdnFileResult = {
    buffer: Buffer;
    contentLength: number;
    contentType: string;
    cacheControl: string;
};

export class CdnFileService {
    constructor(
        private readonly publicDir: string,
        private readonly cache: CacheClient,
        private readonly cacheTtlSeconds = 3600,
        private readonly maxCacheBytes = 5 * 1024 * 1024,
    ) {}

    async getFile(folder: string, filename: string): Promise<CdnFileResult | null> {
        const normalizedFolder = folder ? `${folder}/` : "";
        const filePath = path.join(this.publicDir, normalizedFolder, filename);
        const cacheKey = `cdn:${normalizedFolder}${filename}`;

        try {
            await fs.promises.access(filePath);

            const cached = await this.cache.get(cacheKey);
            if (cached) {
                const buffer = Buffer.from(cached, "base64");
                return this.toResult(filePath, buffer);
            }

            const buffer = await fs.promises.readFile(filePath);
            if (buffer.length < this.maxCacheBytes) {
                await this.cache.setEx(cacheKey, this.cacheTtlSeconds, buffer.toString("base64"));
            }

            return this.toResult(filePath, buffer);
        } catch {
            return null;
        }
    }

    private toResult(filePath: string, buffer: Buffer): CdnFileResult {
        return {
            buffer,
            contentLength: buffer.length,
            contentType: getMimeType(filePath),
            cacheControl: "public, max-age=86400",
        };
    }
}
