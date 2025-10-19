import React from "react";
import {
    FieldValues,
} from "react-hook-form";
import { InputFieldProps } from "./interface";


export const InputField = <T extends FieldValues>({
    type,
    placeholder,
    name,
    register,
    error,
    validation,
}: InputFieldProps<T>) => (
    <div className="w-2xl lg:w-[400px]">
        <input
            type={type}
            placeholder={placeholder}
            className="text-3xl w-full lg:text-base box-border p-4 outline-none border-b-2"
            {...register(name, validation)}
        />
        {error && <div>{error.message}</div>}
    </div>
);