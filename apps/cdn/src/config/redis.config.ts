import { createClient } from "redis";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "./app.config";

export const redisClient = createClient({
    socket: {
        host: REDIS_HOST || "127.0.0.1",
        port: Number(REDIS_PORT) || 6379,
    },
    password: REDIS_PASSWORD,
});

// Обработка ошибок подключения
redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});

redisClient.on("connect", () => {
    console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
    console.log("✅ Redis connected and ready");
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (err: any) {
        console.error("❌ Redis connection failed:", err.message);
        process.exit(1);
    }
};
