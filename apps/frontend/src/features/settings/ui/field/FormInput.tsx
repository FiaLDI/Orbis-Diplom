import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  register: any;
}

export const FormInput: React.FC<Props> = ({ label, error, register, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="mb-1">{label}</label>

      <input
        {...register}
        {...props}
        className={`w-full rounded border border-[#ffffff22] bg-transparent p-2 
                    focus:outline-none focus:border-white ${props.className ?? ""}`}
      />

      {error && <span className="text-red-400 text-sm">{error}</span>}
    </div>
  );
};
