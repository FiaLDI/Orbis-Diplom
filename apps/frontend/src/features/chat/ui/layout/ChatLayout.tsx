import React from "react";

export const ChatLayout: React.FC<{
  history: React.ReactNode;
  input: React.ReactNode;
  head: React.ReactNode;
}> = ({ history, input, head }) => {
  return (
    <div className="flex flex-col h-full w-full p-5 rounded-[5px] lg:h-screen ">
      {head}

      {history}

      {input}
    </div>
  );
};
