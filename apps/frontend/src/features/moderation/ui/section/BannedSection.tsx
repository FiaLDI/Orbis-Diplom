import React from "react";
import { Section } from "../section/Section";
import { SectionHeader } from "../section/SectionHeader";
import { BannedRow } from "./BannedRow";

export const BannedSection: React.FC<{
  title: string;
  refreshingLabel: string;
  loading: boolean;
  items: any[];
  onRefresh: () => void;
  onUnban: (id: string) => void;
  emptyLabel: string;
}> = ({
  title,
  refreshingLabel,
  loading,
  items,
  onRefresh,
  onUnban,
  emptyLabel,
}) => (
  <Section>
    <SectionHeader
      title={title}
      action={
        <button
          onClick={onRefresh}
          className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20"
        >
          {refreshingLabel}
        </button>
      }
    />
    {loading && <div className="opacity-60">Loading…</div>}
    {!items?.length && !loading && (
      <div className="opacity-60">{emptyLabel}</div>
    )}
    <div className="max-h-[300px] overflow-y-auto scroll-hidden">
      {items?.map((ban) => (
        <BannedRow
          key={ban.user_id}
          item={ban}
          onUnban={() => onUnban(ban.targetId)}
        />
      ))}
    </div>
  </Section>
);
