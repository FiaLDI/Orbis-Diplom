import React from "react";

const LanguageSettings: React.FC = () => {
    return (
        <div>
            <h3 className="bg-[#ffffff11] p-2 flex justify-between">Выберите язык </h3>
            <div className="p-2 flex flex-col gap-2">
                
                <div className="w-[150px]"><button disabled className="py-2 w-full bg-[#1f4bda5b] cursor-pointer">Russian</button></div>
                <div className="w-[150px]"><button className="py-2 w-full bg-[#1f4bda5b] cursor-pointer">English</button></div>
            </div>
            
        </div>
    );
};

export default LanguageSettings;
