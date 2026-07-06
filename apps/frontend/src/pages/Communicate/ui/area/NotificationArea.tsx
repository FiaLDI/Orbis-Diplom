import React from "react";
import { MenuNotification } from "@/features/notification";

export const NotificationArea = ({ notificationConnect }: { notificationConnect: boolean }) => (
    <MenuNotification connected={notificationConnect} />
);
