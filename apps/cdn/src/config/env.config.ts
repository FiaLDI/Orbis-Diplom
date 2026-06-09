import dotenv from "dotenv";
import path from "path";

dotenv.config();

export type CDNConfig = {
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    REDIS_TTL: string;
    PORT: number;
    HOST: string;
    FRONTEND: string;
    NODE_ENV: string;
    SSL_KEY?: string;
    SSL_CERT?: string;
    UPLOAD_DIR: string;
    MAX_FILE_SIZE: number;
};

const envConfig: CDNConfig = {
    REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
    REDIS_PORT: process.env.REDIS_PORT || "6379",
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
    REDIS_TTL: process.env.REDIS_TTL || "3600",
    PORT: Number(process.env.PORT) || 4005,
    HOST: process.env.HOST || "0.0.0.0",
    FRONTEND: process.env.FRONTENDADDRES || "https://localhost",
    NODE_ENV: process.env.NODE_ENV || "development",
    SSL_KEY: process.env.SSL_KEY_PATH,
    SSL_CERT: process.env.SSL_CERT_PATH,
    UPLOAD_DIR: process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads"),
    MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
};

export default envConfig;
