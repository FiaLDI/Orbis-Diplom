import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],

    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        watch: {
            usePolling: true,
        },
        https: {
            key: fs.readFileSync(
                path.resolve(__dirname, "ssl/selfsigned_key.pem"),
            ),
            cert: fs.readFileSync(
                path.resolve(__dirname, "ssl/selfsigned.pem"),
            ),
        },
    },
    build: {
        sourcemap: true,
        emptyOutDir: true,
    },
    css: {
        preprocessorOptions: {
            sass: {
                api: "legacy-compiler",
            },
            scss: {},
        },
    },
    define: {
        "process.env": process.env,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimizeDeps: {
        esbuildOptions: {
        sourcemap: false,
        },
    },
});
