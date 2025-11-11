import { Bolt } from "lucide-react";
import React from "react";

export const SettingsButton = ({
    navigateToSettingsPage,
}: {
    navigateToSettingsPage: any;
}) => {
    return (
        <button
            className=" cursor-pointer"
            onClick={navigateToSettingsPage}
        >
            <Bolt
                color="#fff"
                strokeWidth={1.25}
                className="w-8 h-8 transition-transform hover:scale-110"
            />
        </button>
    )
};
