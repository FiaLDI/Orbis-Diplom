import React from "react";
import { HeadComponent, CloseButton } from "@/shared";

interface Props {
    onClose: () => void;
    title: string;
}

export const BanReasonHead: React.FC<Props> = ({ onClose, title }) => (
    <>
        <HeadComponent title={title} />
        <CloseButton handler={onClose} />
    </>
);
