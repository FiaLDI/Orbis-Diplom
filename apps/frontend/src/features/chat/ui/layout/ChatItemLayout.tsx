import React from "react";

export const ChatItemLayout: React.FC<{
    isActive: boolean;
    isServer: boolean;
    chatName: string;
    chatAvatarUrl: string;
}> = ({ isActive, isServer, chatName, chatAvatarUrl }) => {
    return (
        <div
            data-active={isActive}
            className={
                "flex data-[active=true]:bg-[#ffffff3a] gap-3 items-center p-2 rounded-[5px]"
            }
        >
            {!isServer && (
                <div className="w-20 h-20 lg:w-7 lg:h-7 flex-shrink-0 rounded">
                    <img
                        src={chatAvatarUrl || "/img/icon.png"}
                        alt=""
                        className="w-full h-full object-cover rounded"
                    />
                </div>
            )}
            <div className="text-3xl lg:text-base truncate w-full shrink-10 lg:max-w-50">
                {chatName}
            </div>
        </div>
    );
};
