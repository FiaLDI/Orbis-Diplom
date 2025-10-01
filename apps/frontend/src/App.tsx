import React from "react";
//import { PagesRouter } from "./router/PagesRouter";
import { ServerJournalProvider } from "@/contexts/ServerJournalSocketContext";
//import { ManagerVisible } from "./components/ActionVisible/ManagerVisible";
import { PagesRouter } from "@/routes";
import { ActionManager } from "@/features/action";

export const App: React.FC = () => {
    return (
        <>
            <ServerJournalProvider>
                <div className="bg-custom fixed w-full h-full -z-50 overflow-hidden bg-cover bg-no-repeat"></div>
                <PagesRouter />
            </ServerJournalProvider>
            <ActionManager />
        </>
    );
};
