import axios from "axios";
import type { Readable } from "stream";

export type DownloadResult = {
    filename: string;
    stream: Readable;
};

export class DownloadService {
    async fetch(fileUrl: string): Promise<DownloadResult> {
        const response = await axios.get(fileUrl, {
            responseType: "stream",
            timeout: 15_000,
            maxRedirects: 3,
        });

        return {
            filename: "file.pdf",
            stream: response.data,
        };
    }
}
