import { ChangeEvent } from "react";

export interface Props {
    change: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    name?: string;
    placeHolder?: string;
    disabled?: boolean;
}
