import React from "react";
import { FormFieldProps } from "../interfaces";
import { cn } from "@/shared/utils/cn";

export const FormInput = <T extends Record<string, any>>({
    name,
    label,
    register,
    error,
    validation,
    disabled,
    type,
    children,
    className,
}: React.PropsWithChildren<FormFieldProps<T>>) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm opacity-80">{label}</label>}

            <input
                type={type ?? "text"}
                disabled={disabled}
                className={cn(
                    "w-full rounded border border-[#ffffff22] bg-transparent p-2 focus:outline-none focus:border-white",
                    className
                )}
                {...register(name, validation)}
            />

            {error && <span className="text-red-400 text-sm">{error.message}</span>}
        </div>
    );
};
