import React from "react";

export const TitleSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <h2 className="text-4xl text-white text-center">{children}</h2>;
};
