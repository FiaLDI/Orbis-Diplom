import { cn } from "@/shared/utils/cn";
import React from "react";

export const SectionLayout: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={
        cn("mx-auto max-w-2xl py-10 text-white flex flex-col lg:max-w-7xl",
          className
        )}
    >
      {children}
    </div>
  );
};
