import { LoaderCircle } from "lucide-react"; // или Loader, Loader2 и т.д.
import React from "react";

export function Component({ className = "" }) {
    return (
        <LoaderCircle
            strokeWidth={1}
            className={`w-12 h-12 text-blue-500 animate-spin ${className}`}
        />
    );
}
