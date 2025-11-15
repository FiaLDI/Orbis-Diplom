import React from "react";
import { X } from "lucide-react";
import { CloseButton, HeadComponent } from "@/shared";

export const SettingsHeader: React.FC<{
  title: string;
  onClose: () => void;
}> = ({ title, onClose }) => (
  <div className="bg-foreground w-full rounded flex items-center justify-between p-5">
    <HeadComponent title={title} />
    <CloseButton handler={onClose} />
  </div>
);
