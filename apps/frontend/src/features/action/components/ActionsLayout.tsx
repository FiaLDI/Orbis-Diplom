import React, { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { removeAction } from "@/features/action/slice";
import { Visible } from "../types";

export const ActionLayout: React.FC<{
    type: Visible;
    text: string;
    ttl: number;
    id: number;
}> = ({ type, text, ttl, id }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        setTimeout(() => {
            dispatch(removeAction(id));
        }, ttl);
    }, []);

    return (
        <div className="manager-visible">
            <div className="manager-visible__close">
                <button onClick={() => dispatch(removeAction(id))}>X</button>
            </div>
            <h3>{type}</h3>
            <p>{text}</p>
        </div>
    );
};
