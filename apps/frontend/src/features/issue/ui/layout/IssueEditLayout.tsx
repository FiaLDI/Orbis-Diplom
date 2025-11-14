import React from "react";

export const IssueEditLayout: React.FC<{
  head: React.ReactNode;
  form: React.ReactNode;
}> = ({ head, form }) => (
  <div className="text-white w-[500px]">
    <div className="bg-background w-full rounded flex items-center justify-between p-5">
      {head}
    </div>
    {form}
  </div>
);
