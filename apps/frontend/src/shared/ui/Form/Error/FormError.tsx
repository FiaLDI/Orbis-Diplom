import React from "react";

export const FormError: React.FC<{ message?: string }> = ({ message }) => {
    if (!message) return null;
    return <div className="text-red-400 text-center mt-2">{message}</div>;
};
