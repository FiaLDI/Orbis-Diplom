import { ChangeEvent } from "react";

export interface Props {
    change: (e: ChangeEvent) => void;
    value?: string;
    name?: string;
    placeHolder?: string;
}