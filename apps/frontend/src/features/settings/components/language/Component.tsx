import { useAppDispatch, useAppSelector } from "@/app/hooks";
import React from "react";
import { setLanguage, setNotification } from "../../slice";

export const Component: React.FC = () => {
  const settings = useAppSelector((s) => s.settings);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-5 p-5 text-center">
      <h3 className="bg-[#ffffff11] p-2 flex justify-between">Выберите язык </h3>
            <div className="p-2 flex flex-col gap-2">
                
                <div className="w-[150px]">
                  <button 
                    disabled={settings.language === "ru"} 
                    className="py-2 w-full bg-[#1f4bda5b] cursor-pointer disabled:bg-[#7085cb5b]"
                    onClick={()=>dispatch(setLanguage("ru"))}
                  >
                    Russian
                  </button>
                </div>
                <div className="w-[150px]">
                  <button 
                    disabled={settings.language === "en"} 
                    className="py-2 w-full bg-[#1f4bda5b] cursor-pointer disabled:bg-[#7085cb5b]"
                    onClick={()=>dispatch(setLanguage("en"))}
                  >
                    English
                  </button>
                </div>
            </div>
    </div>
  );
};
