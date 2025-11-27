import React from "react";
import { TFunction } from "i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useRegisterModel } from "@/features/auth/hooks";
import { EmailStep } from "./EmailStep";
import { CodeStep } from "./CodeStep";
import { RegisterStep } from "./RegisterStep";
import { BackLink } from "../common/BackLink";

const stepVariants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};

export const RegisterForm: React.FC<{ t: TFunction<"server", undefined> }> = ({
  t,
}) => {
  const register = useRegisterModel();

  const steps = [
    { key: "email", label: t("register.email.title") },
    { key: "code", label: t("register.code.label") },
    { key: "register", label: t("register.register.title") },
  ];

  const currentIndex = steps.findIndex((s) => s.key === register.step);
  const progress = ((currentIndex + 1) / steps.length) * 100;
  const currentLabel = steps[currentIndex]?.label ?? "";

  const renderStep = () => {
    switch (register.step) {
      case "email":
        return (
          <EmailStep
            t={t}
            emailForm={register.emailForm}
            handleSubmit={register.handleEmailSubmit}
          />
        );
      case "code":
        return (
          <CodeStep
            t={t}
            codeForm={register.codeForm}
            handleSubmit={register.handleCodeSubmit}
          />
        );
      case "register":
        return (
          <RegisterStep
            t={t}
            registerForm={register.registerForm}
            handleSubmit={register.handleRegisterSubmit}
            isError={register.isError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="
        rounded-2xl p-8 w-[450px]
        text-white flex flex-col gap-8 overflow-hidden

        bg-[rgba(10,20,40,0.45)]
        backdrop-blur-xl
        border border-cyan-300/20
        shadow-[0_0_30px_rgba(0,200,255,0.15)]
        animate-[fadeIn_0.6s_ease-out]
      "
    >
      {/* Title + Progress */}
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.h1
            key={register.step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="
              text-center text-2xl font-semibold
              drop-shadow-[0_0_12px_rgba(0,255,255,0.4)]
            "
          >
            {currentLabel}
          </motion.h1>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="
              absolute left-0 top-0 h-full bg-cyan-300/60 rounded-full
              shadow-[0_0_8px_rgba(0,255,255,0.6)]
            "
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={register.step}
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex flex-col gap-6"
          layout
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <BackLink
        label={t("back")}
        onClick={() => register.navigate("/login")}
        className="
          text-white/60 hover:text-cyan-300 
          transition-all 
          drop-shadow-[0_0_6px_rgba(0,255,255,0.5)]
        "
      />
    </div>
  );
};
