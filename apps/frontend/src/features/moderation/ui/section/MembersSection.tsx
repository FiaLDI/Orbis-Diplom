// ui/members/MembersSection.tsx
import React from "react";
import { Section } from "../section/Section";
import { SectionHeader } from "../section/SectionHeader";
import { MemberRow } from "./MemberRow";

export const MembersSection: React.FC<{
  title: string;
  users: Array<any>;
  meId: string;
  reasonMap: Record<string, string>;
  setReason: (userId: string, v: string) => void;
  onKick: (userId: string) => void;
  onBan: (userId: string) => void;
  onUnban: (userId: string) => void;
  open: boolean;
  onToggle: () => void;
}> = ({
  title,
  users,
  meId,
  reasonMap,
  setReason,
  onKick,
  onBan,
  onUnban,
  open,
  onToggle,
}) => (
  <>
    <Section>
      <SectionHeader title={title} open={open} onToggle={onToggle} />
    </Section>
    {open && (
      <Section>
        {users.map((user: any) => (
          <MemberRow
            key={user.id} /* ✅ стабильный ключ */
            user={user}
            isSelf={user.id === meId}
            reason={reasonMap[user.id] ?? ""}
            onReasonChange={(v) => setReason(user.id, v)}
            onKick={() => onKick(user.id)}
            onBan={() => onBan(user.id)}
            onUnban={() => onUnban(user.id)}
          />
        ))}
      </Section>
    )}
  </>
);
