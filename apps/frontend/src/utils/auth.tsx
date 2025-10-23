import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute: React.FC<{
    isAuth: boolean;
    children: React.ReactNode;
    path?: string;
}> = ({ isAuth, children, path }) => {
    if (path) {
        return isAuth ? <>{children}</> : <Navigate to={path} />;
    }
    return isAuth ? <>{children}</> : <Navigate to={"/"} />;
};
