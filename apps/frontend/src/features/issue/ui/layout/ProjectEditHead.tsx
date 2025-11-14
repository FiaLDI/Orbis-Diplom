import React from "react";
import { HeadComponent, CloseButton } from "@/shared";

interface Props {
    onClose: () => void;
}

export const ProjectEditHead: React.FC<Props> = ({ onClose }) => (
    <>
        <HeadComponent title="Project editor" />
        <CloseButton handler={onClose} />
    </>
);
