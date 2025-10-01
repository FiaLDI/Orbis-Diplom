import React from "react";

const AppearanceSettings: React.FC = () => {
    return (
        <div className="flex flex-col gap-5 p-10 text-center">
            <h3 className="text-left">Выберите тему</h3>
            <div className="bg-blue-950 p-10 w-[250px]">Стандартная тема</div>
            
            <div className="bg-gray-400 p-10 w-[250px]">Светлая тема</div>
            <div className="bg-gray-900 p-10 w-[250px]">Темная тема</div>
        </div>
    );
};

export default AppearanceSettings;
