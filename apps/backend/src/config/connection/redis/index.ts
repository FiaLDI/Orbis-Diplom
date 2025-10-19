import { createClient } from "redis";
import { ENVCONFIG } from "@/config";

export const redisClient = createClient({
    socket: {
        host: ENVCONFIG.REDIS_HOST || "127.0.0.1",
        port: Number(ENVCONFIG.REDIS_PORT) || 6379,
    },
    password: ENVCONFIG.REDIS_PASSWORD,
});

redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});

redisClient.on("connect", () => {
});

redisClient.on("ready", () => {
    console.log("Redis connected and ready");
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (err: any) {
        console.error("❌ Redis connection failed:", err.message);
        process.exit(1);
    }
};
