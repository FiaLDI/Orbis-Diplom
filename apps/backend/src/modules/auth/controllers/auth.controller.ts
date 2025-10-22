import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma, redisClient } from "@/config";

export const sendCodeCheck = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        // Валидация email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: "Valid email is required" });
        }

        // Генерация 10-значного цифрового кода
        const code = Math.floor(
            1000000000 + Math.random() * 9000000000,
        ).toString();
        // Сохранение в Redis на 5 минут (300 секунд)
        await redisClient.setEx(email, 300, code);
        console.log(`Verification code ${code} generated for ${email}`);

        // В реальном приложении здесь должна быть отправка кода по email
        // Например: await sendEmail(email, code);
        res.json({
            message: "Verification code generated and stored",
            email,
        });
    } catch (err) {
        console.error("Error in sendCodeCheck:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const verifyCode = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        // Валидация входных данных
        if (!email || !code) {
            return res
                .status(400)
                .json({ error: "Email and code are required" });
        }

        // Получаем код из Redis
        const storedCode = await redisClient.get(email);

        if (!storedCode) {
            return res.status(404).json({ error: "Code not found or expired" });
        }

        // Сравниваем коды (без учета регистра, если нужно)
        if (storedCode !== code) {
            return res.status(401).json({ error: "Invalid verification code" });
        }

        // Удаляем код из Redis после успешной проверки
        await redisClient.del(email);

        res.json({
            message: "ok",
            verified: true,
        });
    } catch (err) {
        console.error("Error in verifyCode:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username, birth_date } =
            req.body;

        // Валидация обязательных полей
        if (!email || !password || !username || !birth_date) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Проверка формата email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Проверка сложности пароля
        if (password.length < 8) {
            return res
                .status(400)
                .json({ error: "Password must be at least 8 characters long" });
        }

        // Проверка уникальности email и username
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            return res
                .status(409)
                .json({ error: "Email or username already exists" });
        }

        // Хеширование пароля
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Преобразование даты рождения
        // Преобразование и валидация даты рождения
        const birthDate = new Date(birth_date);

        // Проверка на валидную дату
        if (isNaN(birthDate.getTime())) {
            return res.status(400).json({ error: "Invalid birth date format" });
        }

        // Проверка диапазона (например, пользователи не старше 120 лет и не младше 13)
        const now = new Date();
        const earliestAllowed = new Date(now.getFullYear() - 120, 0, 1); // примерно 1905
        const latestAllowed = new Date(now.getFullYear() - 13, 11, 31); // минимум 13 лет

        if (birthDate < earliestAllowed || birthDate > latestAllowed) {
            return res
                .status(400)
                .json({ error: "Birth date is out of allowed range" });
        }

        const user = await prisma.users.create({
            data: {
                email,
                password_hash: hashedPassword,
                username,
                user_profile: {
                    create: {
                        birth_date: birthDate,
                        avatar_url: "/img/icon.png",
                    },
                },
                user_preferences: {
                    create: {},
                },
            },
            include: {
                user_profile: true,
                user_preferences: true,
            },
        });

        // Удаляем verification code из Redis если он был
        await redisClient.del(email);

        // Генерация JWT токена (опционально)
        // const token = generateToken(result.rows[0].id);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
            },
            // token: token // если используется JWT
        });
    } catch (err: any) {
        console.error("Registration error:", err);
        if (err.code === "P2002") {
            // Prisma unique constraint error code
            return res.status(409).json({ error: "User already exists" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.users.findUnique({
            where: { email },
            include: {
                user_profile: true,
                user_preferences: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash ?? "",
        );
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            { id: user.id },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "15m" },
        );
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "7d" },
        );

        // Сброс старого refresh токена
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });

        // Установка нового refresh токена
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            access_token: accessToken,
            username: user.username,
            info: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar_url: user.user_profile?.avatar_url || null,
                birthDate: user.user_profile?.birth_date || null,
                first_name: user.user_profile?.first_name || null,
                last_name: user.user_profile?.last_name || null,
                gender: user.user_profile?.gender || null,
                location: user.user_profile?.location || null,
                about: user.user_profile?.about || null,
                number: user.number || null,
                displayName:
                    [user.user_profile?.first_name, user.user_profile?.last_name]
                        .filter(Boolean)
                        .join(" ") || user.username,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const refresh = async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token missing" });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!,
        ) as jwt.JwtPayload;

        const user = await prisma.users.findUnique({
            where: { id: decoded.id },
            include: {
                user_profile: true,
            },
        });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Генерация нового access-токена
        const accessToken = jwt.sign(
            { id: user.id },
            process.env.ACCESS_TOKEN_SECRET!,
            {
                expiresIn: "15m",
            },
        );

        res.json({
            access_token: accessToken,
            username: user.username,
            info: {
                id: user.id,
                username: user.username,
                avatar_url: user.user_profile?.avatar_url || null,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Invalid refresh token" });
    }
};

export const protectedRoute = (req: Request, res: Response) => {
    res.json({ message: "This is a protected route", user: (req as any).user });
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: false, // Для локальной разработки
        sameSite: "lax", // Для локальной разработки
        path: "/", // Указываем путь
    });
    res.json({ message: "User logout" });
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Token missing" });

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
        if (!decoded) return res.status(401).json({ error: "Invalid token" });

        const user = await prisma.users.findUnique({
            where: { id: decoded.id },
            include: {
                user_profile: true,
                user_preferences: true,
            },
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        // друзья (двусторонние accepted заявки)
        const friends = await prisma.users.findMany({
            where: {
                OR: [
                    {
                        friend_requests_to: {
                            some: { from_user_id: decoded.id, status: "accepted" },
                        },
                    },
                    {
                        friend_requests_from: {
                            some: { to_user_id: decoded.id, status: "accepted" },
                        },
                    },
                ],
            },
            select: {
                id: true,
                username: true,
                user_profile: { select: { avatar_url: true } },
            },
        });

        // сервера, где состоит
        const servers = await prisma.servers.findMany({
            where: {
                user_server: { some: { user_id: decoded.id } },
            },
            select: {
                id: true,
                name: true,
                avatar_url: true,
            },
        });

        res.json({
            id: user.id,
            email: user.email,
            username: user.username,
            avatar_url: user.user_profile?.avatar_url,
            preferences: user.user_preferences,
            friends,
            servers,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const changePassword = async (req: Request, res: Response) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const token = req.headers["authorization"]?.split(" ")[1];

        if (!token) return res.status(401).json({ error: "Token missing" });
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
        if (!decoded) return res.status(401).json({ error: "Invalid token" });

        const user = await prisma.users.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash ?? "");
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Old password incorrect" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: { id: decoded.id },
            data: { password_hash: hashed },
        });

        res.json({ message: "Password changed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// POST /auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({ error: "Email, code and new password are required" });
        }

        const storedCode = await redisClient.get(email);
        if (!storedCode || storedCode !== code) {
            return res.status(401).json({ error: "Invalid or expired code" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: { email },
            data: { password_hash: hashed },
        });

        await redisClient.del(email);

        res.json({ message: "Password reset successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};