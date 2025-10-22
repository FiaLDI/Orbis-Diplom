import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    useSendVerificationCodeMutation,
    useVerifyCodeMutation,
    useRegisterUserMutation,
} from "../../api";
import { InputField, SubmitButton } from "../fields";
import { useNavigate } from "react-router-dom";

import { Step } from "./interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { CodeFormData, codeSchema, EmailFormData, emailSchema, RegisterFormData, registerSchema } from "../../validation";
import { useTranslation } from "react-i18next";

export const Component: React.FC = () => {
    const { t } = useTranslation("auth");
    const navigator = useNavigate();
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [sendCode] = useSendVerificationCodeMutation();
    const [verifyCode] = useVerifyCodeMutation();
    const [registerUser, { isSuccess, isError }] = useRegisterUserMutation();

    const emailForm = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
    });

    const codeForm = useForm<CodeFormData>({
        resolver: zodResolver(codeSchema),
    });

    const registerForm = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const handleEmailSubmit: SubmitHandler<EmailFormData> = async ({
        email,
    }) => {
        try {
            await sendCode(email).unwrap();
            setEmail(email);
            setStep("code");
        } catch (err) {
            console.error("Error sending code:", err);
        }
    };

    const handleCodeSubmit: SubmitHandler<CodeFormData> = async ({ code }) => {
        if (step == "code") {
            try {
                await verifyCode({ email, code }).unwrap();
                setVerificationCode(code);
                setStep("register");
            } catch (err) {
                console.error("Error verifying code:", err);
                navigator("/register");
            }
        }
    };

    const handleRegisterSubmit: SubmitHandler<RegisterFormData> = async (
        data,
    ) => {
        try {
            await registerUser({
                code: verificationCode,
                email,
                ...data,
            }).unwrap();
        } catch (err) {
            console.error("Registration error:", err);
            navigator("/login/?confirm=false");
        }
    };

    useEffect(() => {
        if (isSuccess) {
            navigator("/login/?confirm=true");
        }
    }, [isSuccess]);

    return (
            <div className="rounded-md p-10 bg-background/30 text-white flex flex-col gap-5 w-[450px]">
                {(step == "email" || step == "code") && (
                    <>
                        <form
                            className="flex flex-col gap-5 w-full "
                            onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                            autoComplete="off"
                        >
                            <div className="w-full">
                                <h1 className="text-center text-2xl">
                                    {t("register.email.title")}
                                </h1>
                            </div>
                            <div className="flex items-end gap-5">
                                <InputField<EmailFormData>
                                    type="email"
                                    placeholder={t("register.email.placeholder")}
                                    name="email"
                                    readOnly={step == "code"}
                                    register={emailForm.register}
                                    error={emailForm.formState.errors.email}
                                />
                                <SubmitButton
                                    label={t("register.email.submit")}
                                    disabled={step == "code"}
                                />
                            </div>
                        </form>
                        <form
                            className="flex flex-col gap-5 "
                            onSubmit={codeForm.handleSubmit(handleCodeSubmit)}
                            autoComplete="off"
                        >
                            <InputField<CodeFormData>
                                readOnly={true}
                                type="text"
                                placeholder={t("register.code.placeholder")}
                                name="code"
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

                {step == "register" && (
                    <form
                        onSubmit={registerForm.handleSubmit(
                            handleRegisterSubmit,
                        )}
                        autoComplete="off"
                        className="flex flex-col gap-10 "
                    >
                        <h1 className="text-center text-2xl">
                            {t("register.register.title")}
                        </h1>
                        <InputField<RegisterFormData>
                            type="text"
                            placeholder={t("register.register.username")}
                            name="username"
                            register={registerForm.register}
                            error={registerForm.formState.errors.username}
                        />
                        <InputField<RegisterFormData>
                            type="password"
                            placeholder={t("register.register.password")}
                            name="password"
                            register={registerForm.register}
                            error={registerForm.formState.errors.password}
                        />
                        <InputField<RegisterFormData>
                            type="date"
                            placeholder={t("register.register.birth_date")}
                            name="birth_date"
                            register={registerForm.register}
                            error={registerForm.formState.errors.birth_date}
                        />
                        <SubmitButton label={t("register.register.submit")} />
                    </form>
                )}
                <span
                    className="text-center relative"
                >
                    <a
                        href=""
                        onClick={(e) => {
                            e.preventDefault();
                            navigator("/login");
                        }}
                    >
                        {t("back")}
                    </a>
                </span>
            </div>
    );
};
