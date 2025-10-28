import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { AuthController } from "./controllers/auth.controller";

const controller = container.get<AuthController>(TYPES.AuthController);
export const authModule = express.Router();

authModule.post("/send_code", controller.sendCode.bind(controller));
authModule.post("/verify", controller.verifyCode.bind(controller));
authModule.post("/register", controller.register.bind(controller));
authModule.post("/login", controller.login.bind(controller));
authModule.post("/refresh", controller.refresh.bind(controller));
authModule.post("/logout", controller.logout.bind(controller));

