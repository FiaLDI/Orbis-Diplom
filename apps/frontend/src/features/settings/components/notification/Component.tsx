import { useAppDispatch, useAppSelector } from "@/app/hooks";
import React from "react";
import { setNotification } from "../../settingsSlice";

export const Component: React.FC = () => {
  const settings = useAppSelector((s) => s.settings);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-5 p-5 text-center">
      <label
        htmlFor="notification"
        className="bg-[#ffffff11] p-2 flex justify-between items-center cursor-pointer select-none rounded-md"
      >
        Включить уведомление?
        <input
          type="checkbox"
          id="notification"
          checked={settings.notification}
          onChange={() => dispatch(setNotification(!settings.notification))}
          className={`
            w-6 h-6 
            appearance-none 
            border border-gray-400 
            rounded-md 
            relative 
            transition-all duration-300 
            cursor-pointer
            flex items-center justify-center

            checked:bg-blue-500 checked:border-blue-500 
            hover:scale-105 active:scale-95

            before:content-['+']
            before:absolute
            before:text-white
            before:text-lg
            before:opacity-0
            before:scale-0
            before:transition-all
            before:duration-300

            checked:before:opacity-100
            checked:before:scale-100
          `}
        />
      </label>
    </div>
  );
};
