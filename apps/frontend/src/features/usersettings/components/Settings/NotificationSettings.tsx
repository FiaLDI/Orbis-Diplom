import React from "react";

const NotificationSettings: React.FC = () => {
    return (
        <div>
            <h3 className="bg-[#ffffff11] p-2 flex justify-between">Включить уведомление? <input 
    type="checkbox" 
    className="
      w-6 h-6 
      appearance-none 
      border border-gray-400 
      rounded-md 
      cursor-pointer 
      transition 
      relative
      [&:after]:absolute
      [&:after]:-bottom-1
      checked:bg-blue-500 
      checked:border-blue-500 
      checked:[&:after]:content-['+'] 
      checked:[&:after]:block 
      checked:[&:after]:text-white 
      checked:[&:after]:text-sm 
      checked:[&:after]:leading-4 
      checked:[&:after]:text-center 
      checked:[&:after]:w-full 
      checked:[&:after]:h-full 
    "
  /></h3> 
            
        </div>
    );
};

export default NotificationSettings;
