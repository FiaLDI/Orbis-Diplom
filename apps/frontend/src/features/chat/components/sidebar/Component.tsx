import React from "react";
import { ChatList } from "@/features/chat";
import { ContextMenu } from "@/features/server";
import { useChatSidebarModel } from "../../model/useChatSidebarModel";
import { SideBarLayout } from "../../ui/layout/SideBarLayout";
import { HeaderSwitch } from "../../ui/layout/HeaderSwitch";

export const Component: React.FC = () => {
    const {
        t,
        activeServer,
        isServer,
        search,
        setSearch,
        menu,
        openMenu,
        closeMenu,
        onToggleSettings,
        onToggleProjects,
        onCreateServerChat,
    } = useChatSidebarModel();

    return (
        <SideBarLayout>
            <div
                className="flex flex-col gap-0 h-full"
                onContextMenu={isServer ? openMenu : undefined}
            >
                <HeaderSwitch
                    t={t}
                    isServer={isServer}
                    serverName={activeServer?.name}
                    search={search}
                    onSearch={setSearch}
                    onSettings={onToggleSettings}
                    onProjects={onToggleProjects}
                />

                <ChatList isServer={isServer} search={search} />

                {isServer && menu && (
                    <ContextMenu
                        x={menu.x}
                        y={menu.y}
                        onClose={closeMenu}
                        onCreateChat={onCreateServerChat}
                    />
                )}
            </div>
        </SideBarLayout>
    );
};
