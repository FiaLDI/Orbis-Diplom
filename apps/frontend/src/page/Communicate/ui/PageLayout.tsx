import React from "react";

export const PageLayout = ({ sidebar, profile, main }: {sidebar: React.ReactNode, profile: React.ReactNode, main: React.ReactNode}) => {
    return (
        <div className="flex flex-col lg:flex-row h-screen w-screen">
            <aside>{sidebar}</aside>
            {profile}
            <main className="flex w-full h-full relative">
                {main}
            </main>
        </div>
    );
};
