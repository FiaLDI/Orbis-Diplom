import { useAppDispatch, useAppSelector } from "@/app/hooks";
import React from "react";
import { setTheme } from "../../slice";

export const Component: React.FC = () => {
    const settings = useAppSelector((s) => s.settings);
    const dispatch = useAppDispatch();
  
    return (
        <div className="flex flex-col gap-5 p-5 text-center min-h-[200px] test-bg ">
            <h3 className="text-left">Выберите тему</h3>
            <button 
              className={
                settings.theme === "standart" ? 
                "bg-blue-950 p-10 w-[250px] border border-white cursor-pointer": 
                "bg-blue-950 p-10 w-[250px] cursor-pointer"
              }
              onClick={()=>dispatch(setTheme("standart"))}
            >
              <div className="">Стандартная тема</div>
            </button>
            <button 
              className=
                {
                  settings.theme === "light" ? 
                  "bg-gray-400 p-10 w-[250px] border border-white cursor-pointer": 
                  "bg-gray-400 p-10 w-[250px] cursor-pointer"
                }
              onClick={()=>dispatch(setTheme("light"))}
              >
              <div className="">Светлая тема</div>
            </button>
            <button 
              className={
                settings.theme === "dark" ? 
                "bg-gray-900 p-10 w-[250px] border border-white cursor-pointer": 
                "bg-gray-900 p-10 w-[250px] cursor-pointer"
              }
              onClick={()=>dispatch(setTheme("dark"))}
              >
              <div className="">Темная тема</div>
            </button>
        </div>
    );
};
