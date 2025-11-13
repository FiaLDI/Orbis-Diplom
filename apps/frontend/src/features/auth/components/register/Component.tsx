import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    useSendVerificationCodeMutation,
    useVerifyCodeMutation,
    useRegisterUserMutation,
} from "@/features/auth/api";

import {
    EmailFormData,
    CodeFormData,
    RegisterFormData,
    emailSchema,
    codeSchema,
    registerSchema,
} from "@/features/auth/validation";

import { Step } from "./interface";
import { FormInput, SubmitButton, FormError } from "@/shared/ui/Form";

export const RegisterForm: React.FC = () => {
    const { t } = useTranslation("auth");
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");

    const [sendCode] = useSendVerificationCodeMutation();
    const [verifyCode] = useVerifyCodeMutation();
    const [registerUser, { isSuccess, isError }] = useRegisterUserMutation();

    // Email form
    const emailForm = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
    });

    // Code form
    const codeForm = useForm<CodeFormData>({
        resolver: zodResolver(codeSchema),
    });

    // Register form
    const registerForm = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    /** STEP 1: Send verification email */
    const handleEmailSubmit: SubmitHandler<EmailFormData> = async ({ email }) => {
        try {
            await sendCode(email).unwrap();
            setEmail(email);
            setStep("code");
        } catch (err) {
            console.error("Error sending code:", err);
        }
    };

    /** STEP 2: Verify code */
    const handleCodeSubmit: SubmitHandler<CodeFormData> = async ({ code }) => {
        if (step === "code") {
            try {
                await verifyCode({ email, code }).unwrap();
                setVerificationCode(code);
                setStep("register");
            } catch (err) {
                console.error("Error verifying code:", err);
                navigate("/register");
            }
        }
    };

    /** STEP 3: Register user */
    const handleRegisterSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        try {
            await registerUser({
                code: verificationCode,
                email,
                ...data,
            }).unwrap();
        } catch (err) {
            console.error("Registration error:", err);
            navigate("/login/?confirm=false");
        }
    };

    /** Handle successful registration */
    useEffect(() => {
        if (isSuccess) {
            navigate("/login/?confirm=true");
        }
    }, [isSuccess]);

    return (
        <div
            className={"rounded-md p-10 bg-background/30 text-white flex flex-col gap-5 w-[450px]"}
        >
            {/* === STEP 1: EMAIL & CODE === */}
            {(step === "email" || step === "code") && (
                <>
                    {/* Email form */}
                    <form
                        className="flex flex-col gap-5 w-full"
                        onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                        autoComplete="off"
                    >
                        <h1 className="text-center text-2xl">{t("register.email.title")}</h1>

                        <div className="flex items-end gap-3">
                            <FormInput<EmailFormData>
                                name="email"
                                type="email"
                                placeholder={t("register.email.placeholder")}
                                label={t("register.email.label")}
                                disabled={step === "code"}
                                register={emailForm.register}
                                error={emailForm.formState.errors.email}
                            />
                            <SubmitButton
                                label={t("register.email.submit")}
                                disabled={step === "code"}
                            />
                        </div>
                    </form>

                    {/* Code form */}
                    <form
                        className="flex flex-col gap-5"
                        onSubmit={codeForm.handleSubmit(handleCodeSubmit)}
                        autoComplete="off"
                    >
                        <FormInput<CodeFormData>
                            name="code"
                            type="text"
                            label={t("register.code.label")}
                            placeholder={t("register.code.placeholder")}
                            register={codeForm.register}
                            error={codeForm.formState.errors.code}
                            disabled={step !== "code"}
                        />
                        <SubmitButton
                            label={t("register.code.submit")}
                            disabled={step !== "code"}
                        />
                    </form>
                </>
            )}

            {/* === STEP 3: REGISTER === */}
            {step === "register" && (
                <form
                    onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
                    autoComplete="off"
                    className="flex flex-col gap-6"
                >
                    <h1 className="text-center text-2xl">{t("register.register.title")}</h1>

                    <FormInput<RegisterFormData>
                        name="username"
                        type="text"
                        label={t("register.register.username")}
                        placeholder={t("register.register.username")}
                        register={registerForm.register}
                        error={registerForm.formState.errors.username}
                    />

                    <FormInput<RegisterFormData>
                        name="password"
                        type="password"
                        label={t("register.register.password")}
                        placeholder={t("register.register.password")}
                        register={registerForm.register}
                        error={registerForm.formState.errors.password}
                    />

                    <FormInput<RegisterFormData>
                        name="birth_date"
                        type="date"
                        label={t("register.register.birth_date")}
                        placeholder={t("register.register.birth_date")}
                        register={registerForm.register}
                        error={registerForm.formState.errors.birth_date}
                    />

                    <SubmitButton label={t("register.register.submit")} />
                    <FormError message={isError ? t("register.error") : undefined} />
                </form>
            )}

            <span className="text-center text-sm text-white/70">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/login");
                    }}
                    className="underline hover:text-white"
                >
                    {t("back")}
                </a>
            </span>
        </div>
    );
};
