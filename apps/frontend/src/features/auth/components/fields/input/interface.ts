import { UseFormRegister, FieldError, FieldValues, RegisterOptions, Path } from "react-hook-form";

export interface InputFieldProps<T extends FieldValues> {
    type: string;
    placeholder: string;
    name: Path<T>;
    readOnly?: boolean;
    register: UseFormRegister<T>;
    error?: FieldError;
    validation?: RegisterOptions<T>;
    disabled?: boolean;
}
