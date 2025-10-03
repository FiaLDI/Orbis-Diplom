import React from "react";
import { SettingsButton } from "./ui/Button";

const SettingsController: React.FC = () => {

    return (
        <div className="fixed right-5 bottom-5">
        <SettingsButton
                    handler={() => {}}
                >
                    Change
                </SettingsButton>
        </div>
    )
}


export default SettingsController;