import React from "react";

interface Props {
    back: React.ReactNode;
    head: React.ReactNode;
    viewChange: React.ReactNode;
    createIssue: React.ReactNode;
    IssueFormModal: React.ReactNode;
    view: React.ReactNode;
    issue: React.ReactNode;
    menu: React.ReactNode;
    assign: React.ReactNode;
}

export const IssueListLayout: React.FC<Props> = ({
    back,
    head,
    viewChange,
    createIssue,
    IssueFormModal,
    view,
    issue,
    menu,
    assign,
}) => (
    <div className="h-full w-full overflow-y-auto scroll-hidden">
        <div className="bg-background/50 backdrop-blur-sm border-r border-white/30  p-3 flex w-full justify-between items-center">
            <h4 className="truncate text-lg text-white flex w-full gap-5 items-center">
                {back}
                {head}
                <div className="flex gap-2">
                    {viewChange}
                    <div className="flex gap-2">
                        {createIssue}
                        {IssueFormModal}
                    </div>
                </div>
            </h4>
        </div>

        <div className="w-full h-full flex">
            <div className="h-full w-full p-5 text-white">{view}</div>

            {issue}
        </div>

        {menu}

        {assign}
    </div>
);
