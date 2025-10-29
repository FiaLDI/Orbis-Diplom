import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import type { AuthController } from "./controllers/auth.controller";

export const authModule = () => {
    const router = express.Router();
    const controller = container.get<AuthController>(TYPES.AuthController);

    router.post("/send-code", controller.sendCode.bind(controller));
    router.post("/verify-code", controller.verifyCode.bind(controller));
    router.post("/register", controller.register.bind(controller));
    router.post("/login", controller.login.bind(controller));
    router.post("/refresh", controller.refresh.bind(controller));
    router.post("/logout", controller.logout.bind(controller));

    return router;
};
