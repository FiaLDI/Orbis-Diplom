import React from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    register: any;
}

export const FormTextArea: React.FC<Props> = ({ label, error, register, ...props }) => (
    <div>
        <label className="block mb-2">{label}</label>

        <textarea
            {...register}
            {...props}
            className={`p-2 border rounded bg-transparent w-full resize-none ${props.className ?? ""}`}
        />

        {error && <span className="text-red-400 text-sm">{error}</span>}
    </div>
);
