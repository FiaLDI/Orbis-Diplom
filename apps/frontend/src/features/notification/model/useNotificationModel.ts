import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  useDeleteAllNotificationMutation,
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationReadMutation,
  useMarkNotificationReadMutation,
} from "../api";
import { useTranslation } from "react-i18next";
import { clearNotifications, markAsRead, removeNotification } from "../slice";

export function useNotificationModel(connection: boolean) {
  const { t } = useTranslation("notification");
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const {
    data: apiNotifications = [],
    isFetching,
    refetch,
  } = useGetNotificationsQuery(undefined, {
    skip: !open,
  });
  const [markRead] = useMarkNotificationReadMutation();
  const [deleteNotif] = useDeleteNotificationMutation();

  const [allDeleteNotif] = useDeleteAllNotificationMutation();
  const [allMarkRead] = useMarkAllNotificationReadMutation();

  const notifications = useAppSelector((s) => s.notification.list);

  useEffect(() => {
    if (open && apiNotifications.length) {
      refetch();
    }
  }, [open, apiNotifications, dispatch]);

  const handleMarkRead = async (id: string) => {
    try {
      await markRead(id);
      dispatch(markAsRead(id));
    } catch (e) {
      console.error("markRead error", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotif(id);
      dispatch(removeNotification(id));
    } catch (e) {
      console.error("deleteNotif error", e);
    }
  };

  const handleMarkAll = async () => {
    try {
      await allMarkRead({});
      notifications.forEach((n) => {
        if (!n.is_read) dispatch(markAsRead(n.id));
      });
    } catch (e) {
      console.error("Marked error", e);
    }
  };

  const handleClearAll = async () => {
    try {
      await allDeleteNotif({});
      dispatch(clearNotifications());
    } catch (e) {
      console.error("Cleared error", e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  return {
    t,
    open,
    unreadCount,
    isFetching,
    notifications,
    setOpen,
    handleClearAll,
    handleDelete,
    handleMarkAll,
    handleMarkRead,
  };
}
