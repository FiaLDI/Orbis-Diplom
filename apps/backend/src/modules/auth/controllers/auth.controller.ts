import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "@/di/types";
import { AuthService } from "../services/auth.service";
import { SendCodeSchema } from "../dtos/sendCode.dto";
import { VerifyCodeSchema } from "../dtos/verifyCode.dto";
import { RegisterSchema } from "../dtos/register.dto";
import { LoginSchema } from "../dtos/login.dto";
import { RefreshSchema } from "../dtos/refresh.dto";

@injectable()
export class AuthController {
    constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

    sendCode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = SendCodeSchema.parse(req.body);
            const codeEntity = await this.authService.sendCode(dto.email);

            console.log(codeEntity);

            return res.json({
                message: "Verification code generated and stored",
                email: codeEntity.email,
            });
        } catch (err) {
            next(err);
        }
    };

    verifyCode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = VerifyCodeSchema.parse(req.body);
            const result = await this.authService.verifyCode(dto.email, dto.code);
            return res.json({ message: "ok", ...result });
        } catch (err) {
            next(err);
        }
    };

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = RegisterSchema.parse(req.body);
            const created = await this.authService.register(dto);
            return res.status(201).json(created);
        } catch (err) {
            next(err);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = LoginSchema.parse(req.body);
            const { token, user } = await this.authService.login(dto.email, dto.password);

            res.cookie("refresh_token", token.refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({
                access_token: token.access_token,
                username: user.toJSON().username,
                info: user.toJSON(),
            });
        } catch (err) {
            next(err);
        }
    };

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = RefreshSchema.parse({
                refresh_token: req.cookies?.refresh_token,
            });

            const { token, user } = await this.authService.refresh(dto.refresh_token);

            return res.json({
                access_token: token.access_token,
                username: user.toJSON().username,
                info: user.toJSON(),
            });
        } catch (err) {
            next(err);
        }
    };

    logout = async (req: Request, res: Response) => {
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });
        return res.json({ message: "User logout" });
    };
}
