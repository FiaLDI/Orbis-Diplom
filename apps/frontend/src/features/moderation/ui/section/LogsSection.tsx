import React from "react";
import { Section } from "../section/Section";
import { SectionHeader } from "../section/SectionHeader";
import { LogRow } from "./LogRow";

export const LogsSection: React.FC<{
  title: string;
  loading: boolean;
  items: any[];
  onRefresh: () => void;
  emptyLabel: string;
}> = ({ title, loading, items, onRefresh, emptyLabel }) => (
  <Section>
    <SectionHeader
      title={title}
      action={
        <button
          onClick={onRefresh}
          className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20"
        >
          Refresh
        </button>
      }
    />
    {loading && <div className="opacity-60">Loading…</div>}
    {!items?.length && !loading && (
      <div className="opacity-60">{emptyLabel}</div>
    )}
    <div className="max-h-[300px] overflow-y-auto scroll-hidden">
      {items.map((log) => (
        <LogRow key={log.id} log={log} />
      ))}
    </div>
  </Section>
);
