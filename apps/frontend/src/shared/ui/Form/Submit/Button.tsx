import { cn } from "@/shared/utils/cn";
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, disabled, asChild, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled}
                className={cn(
                    "rounded-md bg-white/10 hover:bg-white/20 transition text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed",
                    "whitespace-nowrap",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
