import express from "express";
import {
    login,
    refresh,
    protectedRoute,
    logout,
    sendCodeCheck,
    verifyCode,
    register,
    getMe,
    changePassword,
    forgotPassword,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

export const authRoutes = express.Router();

authRoutes.post("/send_code", sendCodeCheck);
authRoutes.post("/verify", verifyCode);
authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/refresh", authenticate, refresh);
authRoutes.get("/me", getMe);
authRoutes.post("/change-password", changePassword);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.get("/protected", authenticate, protectedRoute);
