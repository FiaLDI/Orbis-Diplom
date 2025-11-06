import dotenv from "dotenv";
dotenv.config();

export const ENVCONFIG = {
    PORT: process.env.PORT,
    FRONTENDADDRES: process.env.FRONTENDADDRES,
    REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
    REDIS_PORT: process.env.REDIS_PORT || "6379",
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
    REDIS_TTL: process.env.REDIS_TTL || "3600",
};
