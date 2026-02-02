import { cn } from "@/shared/utils/cn";
import React, { useCallback } from "react";
import { ICompoentProps } from "./interface";
import { ButtonLink } from "../../button/link";

export const NavigationMenu: React.FC<ICompoentProps & { mobile?: boolean }> = ({
  navigate,
  mobile = false,
}) => {
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
        "flex gap-6 items-center",
        mobile && "flex-col gap-4 py-5 text-2xl border-t border-cyan-400/10",
        !mobile && "text-lg"
      )}
    >
      {menuItems().map((item, i) => (
        <ButtonLink key={i} href="#" children={<>{item.label}</>}/>
      ))}
    </ul>
  );
};
