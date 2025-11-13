import { FieldValues, Path, UseFormRegister, FieldError, RegisterOptions } from "react-hook-form";

export interface FormInputProps<T extends FieldValues> {
    name: Path<T>;
    label?: string;
    type?: string;
    placeholder?: string;
    register: UseFormRegister<T>;
    error?: FieldError;
    validation?: RegisterOptions<T>;
    disabled?: boolean;
}

export interface FormFieldProps<T extends FieldValues> {
    name: Path<T>;
    label?: string;
    placeholder?: string;
    type?: string;
    register: UseFormRegister<T>;
    error?: FieldError;
    validation?: RegisterOptions<T>;
    disabled?: boolean;
    className?: string;
}
