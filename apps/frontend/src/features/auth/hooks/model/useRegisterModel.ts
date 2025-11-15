import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useRegisterUserMutation,
  useSendVerificationCodeMutation,
  useVerifyCodeMutation,
} from "@/features/auth/api";
import {
  CodeFormData,
  codeSchema,
  EmailFormData,
  emailSchema,
  RegisterFormData,
  registerSchema,
} from "@/features/auth/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

export type Step = "email" | "code" | "register";

export const useRegisterModel = () => {
  const navigate = useNavigate();

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

  const handleEmailSubmit: SubmitHandler<EmailFormData> = async ({ email }) => {
    try {
      await sendCode(email).unwrap();
      setEmail(email);
      setStep("code");
    } catch (err) {
      console.error("Error sending code:", err);
    }
  };

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
      navigate("/login/?confirm=false");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/login/?confirm=true");
    }
  }, [isSuccess]);

  return {
    isError,
    step,
    emailForm,
    codeForm,
    registerForm,
    handleEmailSubmit,
    handleCodeSubmit,
    handleRegisterSubmit,
    navigate,
  };
};
