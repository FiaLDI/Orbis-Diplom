import { createClient } from "redis";
import envConfig from "./env.config";

export const redisClient = createClient({
    socket: {
        host: envConfig.REDIS_HOST,
        port: Number(envConfig.REDIS_PORT),
    },
    password: envConfig.REDIS_PASSWORD,
});

redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});

export const connectRedis = async () => {
    if (redisClient.isOpen) return;

    try {
        await redisClient.connect();
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Redis connection failed:", message);
        process.exit(1);
    }
};
