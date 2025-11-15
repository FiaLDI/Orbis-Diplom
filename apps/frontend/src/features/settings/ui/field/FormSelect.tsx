import React from "react";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    register: any;
}

export const FormSelect: React.FC<Props> = ({ label, error, register, children, ...props }) => (
    <div>
        <label className="block mb-2">{label}</label>

        <select
            {...register}
            {...props}
            className={`p-2 border rounded bg-transparent w-full ${props.className ?? ""}`}
        >
            {children}
        </select>

        {error && <span className="text-red-400 text-sm">{error}</span>}
    </div>
);
