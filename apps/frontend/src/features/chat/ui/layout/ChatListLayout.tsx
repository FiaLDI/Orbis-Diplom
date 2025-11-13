import React from "react";

export const ChatListLayout: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    return <ul className="flex flex-col gap-2 h-full p-3 text-white rounded-[5px]">{children}</ul>;
};
