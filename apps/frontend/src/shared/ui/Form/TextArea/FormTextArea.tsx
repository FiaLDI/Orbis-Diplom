import React from "react";
import { FormFieldProps } from "../interfaces";

export const FormTextArea = <T extends Record<string, any>>({
  name,
  label,
  placeholder,
  register,
  error,
  validation,
  disabled,
  className,
  ...props
}: FormFieldProps<T> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-sm opacity-80">{label}</label>}

    <textarea
      placeholder={placeholder}
      disabled={disabled}
      className={`p-2 rounded border border-[#ffffff22] bg-transparent w-full resize-none focus:outline-none focus:border-white ${
        error ? "border-red-400" : ""
      } ${className ?? ""}`}
      {...register(name, validation)}
      {...props}
    />

    {error && <span className="text-red-400 text-sm">{error.message}</span>}
  </div>
);
