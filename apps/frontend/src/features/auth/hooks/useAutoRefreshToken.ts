import { useEffect } from "react";
import { useRefreshTokenMutation } from "../api";
import { useAppSelector } from "@/app/hooks";

export const useAutoRefreshToken = (intervalMinutes = 10) => {
    const [refresh] = useRefreshTokenMutation();
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) return;

        refresh({});

        const interval = setInterval(
            () => {
                refresh({});
            },
            intervalMinutes * 60 * 1000
        );

        return () => clearInterval(interval);
    }, [isAuthenticated, refresh, intervalMinutes]);
};
