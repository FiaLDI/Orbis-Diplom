import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { ModalLayout } from "@/components/layout/Modal/Modal";
import { ComponentProps } from "./interface";

export const Component: React.FC<ComponentProps> = ( {permissions} ) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
        <button onClick={()=> setOpen(prev => !prev)} className="cursor-pointer px-5 py-2 bg-[#2e3ed328]">Show permission</button>
        <ModalLayout open={open} onClose={()=> setOpen(false)}>
            <div>
                {permissions.map((permission, indexPermission) => {
                    return (
                        <div key={`permission-${indexPermission}`} className="flex justify-between">
                            <div className="">
                                {permission.name}
                            </div> 
                            <div className="">
                                <input type="checkbox" name="" id="" />
                            </div>
                        </div>
                    )
                })}
            </div>
        </ModalLayout>
        </>
    );
};
