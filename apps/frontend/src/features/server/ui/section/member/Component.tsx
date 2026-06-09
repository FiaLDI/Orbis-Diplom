import React from "react";
import { useMembersPanelModel } from "@/features/server/hook";
import { MemberItem } from "@/features/server/ui/layout/MemberItem";
import { AnimatedContextMenu } from "@/shared";
import { BanReasonModal } from "@/features/moderation";

export const MembersSidebar: React.FC = () => {
  const m = useMembersPanelModel();

  if (!m.users?.length) return null;

  return (
    <>
      <div className="bg-background/20 backdrop-blur-xl text-white text-lg flex flex-col w-[200px] lg:w-[400px] lg:min-w-[250px] lg:max-w-[250px] border-l border-white/30">
        <h2 className="w-full flex justify-between border-b border-white/30 text-white text-lg bg-foreground/5 backdrop-blur-xl p-3">
          Участники: {m.count}
        </h2>

        <ul className="flex flex-col gap-3 h-full p-3">
          {m.users.map((u) => (
            <MemberItem
              key={u.id}
              user={u}
              onClick={m.onClickUser}
              onContextMenu={m.menu.open}
            />
          ))}
        </ul>
      </div>

      <AnimatedContextMenu
        visible={m.menu.visible}
        x={m.menu.x}
        y={m.menu.y}
        menuRef={m.menu.ref}
        onClose={m.menu.close}
        items={
          m.menu.items.map((it: any) =>
            it.type === "separator"
              ? { label: "────────", action: () => {}, disabled: true }
              : {
                  label: it.label,
                  action: it.action,
                  danger: it.danger,
                  disabled: it.disabled,
                },
          ) as any[]
        }
      />

      <BanReasonModal
        open={m.banModal.state.open}
        username={m.banModal.state.username}
        onClose={m.banModal.close}
        onConfirm={m.banModal.confirm}
      />
    </>
  );
};
