import React from "react";
import { Plus, X } from "lucide-react";
import { RoleRow } from "../RoleRow";

type TFn = (key: string) => string;

export const InviteSection: React.FC<{
  serverId: string;
  inviteLinks?: any[];
  onCreateInviteLink: (serverId: string) => void;
  onDeleteInviteLink: ({ serverId, code }: any) => void;
}> = ({ serverId, inviteLinks, onCreateInviteLink, onDeleteInviteLink }) => {
  return (
    <div className="p-5 flex flex-col w-full gap-5 border-b border-white/20">
      <div className="w-full flex gap-5 items-center">
        <h4 className="text-2xl">Invites</h4>
        <button
          className="cursor-pointer px-1 py-1 bg-foreground rounded-full"
          onClick={() => onCreateInviteLink(serverId)}
        >
          <Plus />
        </button>
      </div>

      <div className="w-full flex flex-col gap-3">
        {inviteLinks &&
          inviteLinks?.length &&
          inviteLinks.map((val, idx) => (
            <div key={`${val.code}-${idx}`} className="flex gap-5 items-center">
              <input
                type={"text"}
                disabled={val.uses == val.max_uses}
                className={
                  "w-full rounded border border-[#ffffff22] bg-transparent p-2 focus:outline-none focus:border-white"
                }
                value={val.code}
                readOnly
              />
              <div className="min-w-10 w-10 text-center">
                {val.uses}/{val.max_uses}
              </div>{" "}
              <button
                onClick={() =>
                  onDeleteInviteLink({ serverId: serverId, code: val.code })
                }
              >
                <X />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};
