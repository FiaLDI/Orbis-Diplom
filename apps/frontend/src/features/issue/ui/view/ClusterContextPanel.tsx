import React from "react";

interface ClusterContextPanelProps {
  context: {
    parent: any | null;
    children: any[];
    siblings: any[];
  };
  onSelect: (issueId: string) => void;
}

export const ClusterContextPanel: React.FC<ClusterContextPanelProps> = ({
  context,
  onSelect,
}) => {
  if (!context) return null;

  const Section = ({ title, items }: any) => (
    items.length ? (
      <div className="mb-4">
        <div className="text-xs uppercase opacity-60 mb-1">{title}</div>
        {items.map((i: any) => (
          <div
            key={i.id}
            onClick={() => onSelect(i.id)}
            className="text-sm px-2 py-1 rounded hover:bg-background cursor-pointer truncate"
          >
            {i.title}
          </div>
        ))}
      </div>
    ) : null
  );

  return (
    <div className="w-64 border-l border-border px-3 py-4 text-sm">
      {context.parent && (
        <Section title="Parent" items={[context.parent]} />
      )}
      <Section title="Children" items={context.children} />
      <Section title="Siblings" items={context.siblings} />
    </div>
  );
};
