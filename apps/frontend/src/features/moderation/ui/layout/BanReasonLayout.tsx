import React from "react";

export const BanReasonLayout: React.FC<{
  head: React.ReactNode;
  textarea: React.ReactNode;
  controll: React.ReactNode;
}> = ({ head, textarea, controll }) => {
  return (
    <div className="flex flex-col text-white w-[400px]">
      <div className="bg-background w-full rounded flex items-center justify-baseline p-5">
        {head}
      </div>
      <div className="p-5 flex flex-col gap-5">
        {textarea}
        <div className="flex justify-end gap-3">{controll}</div>
      </div>
    </div>
  );
};
