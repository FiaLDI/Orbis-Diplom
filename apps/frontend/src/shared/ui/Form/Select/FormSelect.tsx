import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { UseFormSetValue, Path, FieldError } from "react-hook-form";

export interface FormSelectOption {
  label: string;
  value: string | number;
}

export interface FormSelectProps<T extends Record<string, any>> {
  name: Path<T>;
  label?: string;
  value?: string | number | undefined;
  options: FormSelectOption[];
  setValue: UseFormSetValue<T>;
  error?: FieldError;
  className?: string;
  disabled?: boolean;
}

export const FormSelect = <T extends Record<string, any>>({
  name,
  label,
  value,
  options,
  setValue,
  error,
  className,
  disabled,
}: FormSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | number | undefined>(value);
  const ref = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Обновляем локальное состояние при изменении value (watch)
  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (val: string | number) => {
    setSelected(val);
    setValue(name as any, val as any); // безопасно
    setOpen(false);
  };

  const selectedLabel =
    options.find((o) => o.value === selected)?.label || "Select...";

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-1 w-full relative ${className ?? ""}`}
    >
      {label && <label className="text-sm opacity-80">{label}</label>}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={`relative w-full flex items-center justify-between rounded border border-[#ffffff22] 
                    bg-transparent p-2 text-left focus:outline-none focus:border-white transition-all
                    ${error ? "border-red-400" : ""}
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                    ${open ? "border-white/60" : ""}`}
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute mt-1 z-50 w-full rounded border border-[#ffffff22] bg-background/90 backdrop-blur-md 
                       max-h-48 overflow-auto shadow-lg top-16"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`px-3 py-2 cursor-pointer hover:bg-white/10 transition ${
                  opt.value === selected ? "bg-white/20" : ""
                }`}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && <span className="text-red-400 text-sm">{error.message}</span>}
    </div>
  );
};
