import React from "react";

interface Props {
  header: React.ReactNode;
  body: React.ReactNode;
}

export const ProjectListLayout: React.FC<Props> = ({ header, body }) => (
  <div className="h-full w-full overflow-y-auto scroll-hidden">
    {header}
    {body}
  </div>
);
