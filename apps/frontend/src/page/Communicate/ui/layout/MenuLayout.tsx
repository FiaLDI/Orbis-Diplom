import React from "react";

export const MenuLayout = ({
    PersonalMode, 
    ServerList, 
    CreateServerForm,
    MenuNotification,
    SettingsMode
}: {
    PersonalMode?: React.ReactNode, 
    ServerList?: React.ReactNode, 
    CreateServerForm?: React.ReactNode, 
    MenuNotification?: React.ReactNode, 
    SettingsMode?: React.ReactNode, 
}) => {
    return (
        <div className="order-10 lg:order-0 w-full flex lg:w-fit lg:flex-col justify-between items-center lg:h-full bg-background p-3 pt-5 pb-5 relative">
            <div className="flex lg:flex-col gap-2">
                <div className="">
                    {PersonalMode}
                </div>
                <div className="flex gap-2 flex-col justify-center">
                    <div className="">  
                        {ServerList}
                    </div>
                    <div className="flex gap-2 flex-col justify-center">
                        {CreateServerForm}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {MenuNotification}
                {SettingsMode}
            </div>
        </div>
    );
};
