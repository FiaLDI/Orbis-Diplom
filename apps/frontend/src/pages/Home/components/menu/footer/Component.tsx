import { cn } from "@/shared/utils/cn";
import React, { useCallback } from "react";
import { ICompoentProps } from "./interface";
import { ButtonLink } from "../../button/link";

export const NavigationMenu: React.FC<ICompoentProps> = ({ navigate }) => {

  const menuItems = useCallback(()=> {
      return [
          { label: "Загрузить", href: "#start" },
          { label: "Узнать больше", href: "#more" },
          { label: "Политика", onClick: () => navigate?.("political") },
          { label: "Поддержка", href: "#support" },
        ]
    }, [])

  return (
    <ul
      className={cn(
        "flex flex-col lg:flex-col gap-2",
        "text-lg opacity-90",
        "[&>li>a]:cursor-pointer [&>li>a]:select-none",
        "[&>li>a]:transition-all [&>li>a]:duration-300",
        "[&>li]:px-2 [&>li]:py-1"
      )}
    >
      {menuItems().map((item, i) => (
        <ButtonLink key={i} href="#" children={<>{item.label}</>}/>
      ))}
      
    </ul>
  );
};
