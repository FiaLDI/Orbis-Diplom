import React from "react";
import { MemberRow } from "../MemberRow";

type TFn = (key: string) => string;

export const MembersSection: React.FC<{
    t: TFn;
    serverId: string;
    members: any[];
    roles: any[];
    emitServerUpdate: (type: any, serverId: string) => void;
}> = ({ t, serverId, members, roles, emitServerUpdate }) => {
    return (
        <div className="p-5 flex flex-col gap-5 border-b border-white/20">
            <h4 className="text-2xl">{t("settings.members")}</h4>
            {members.map((user) => (
                <MemberRow
                    key={user.id}
                    member={user}
                    serverId={serverId}
                    roles={roles.map((r: any) => ({
                        id: r.id,
                        name: r.name,
                        color: r.color,
                    }))}
                    emitServerUpdate={emitServerUpdate}
                    t={t as any}
                />
            ))}
        </div>
    );
};
