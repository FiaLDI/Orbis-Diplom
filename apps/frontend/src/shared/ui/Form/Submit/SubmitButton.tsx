import React from "react";
import { Button } from "./Button";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const SubmitButton = React.forwardRef<
  HTMLButtonElement,
  SubmitButtonProps
>(
  (
    { asChild, label, loading, disabled, children, className, ...props },
    ref,
  ) => {
    const baseProps = {
      type: "submit" as const,
      disabled: disabled || loading,
      ref,
      ...props,
      children: loading ? (
        <span className="opacity-70 animate-pulse">
          {label ?? children ?? "Отправка..."}
        </span>
      ) : (
        (label ?? children)
      ),
      className: `${className}`.trim(),
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement, baseProps);
    }

    return <Button {...baseProps} />;
  },
);

SubmitButton.displayName = "SubmitButton";
