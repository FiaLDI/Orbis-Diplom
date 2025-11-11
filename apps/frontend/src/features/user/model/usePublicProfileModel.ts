import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { closeProfile } from "../slice";

export function usePublicProfileModel() {
    const [open, setOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((s) => s.user.openProfile);
    const check = useAppSelector((s) => s.user.isOpenProfile);

    const closeProfileHandler = () => {
        dispatch(closeProfile());
        setOpen((prev) => !prev);
    }
    
    useEffect(() => {
        if (check) {
            setOpen(true);
        }
    }, [check]);

    return {
        userInfo,
        open,
        closeProfileHandler,
    };
}
