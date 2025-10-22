import React from "react";
import {
    FieldValues,
} from "react-hook-form";
import { InputFieldProps } from "./interface";


export const InputField = <T extends FieldValues>({
    type,
    placeholder,
    name,
    disabled,
    register,
    error,
    validation,
}: InputFieldProps<T>) => (
    <div className="w-full flex relative mb-2">
        <input
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className="flex w-full text-base box-border p-3 outline-none border-b bg-transparent autofill-transparent"
            {...register(name, validation)}
        />
        {error && <div className=" absolute -bottom-7">{error.message}</div>}
    </div>
);