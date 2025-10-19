import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, Loader2 } from "lucide-react";
import { ModalLayout } from "@/shared";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
} from "../../api";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setNotifications,
  markAsRead,
  removeNotification,
  clearNotifications,
} from "../../slice";
import { Props } from "./interface";

export const Component: React.FC<Props> = ({connected}) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  // API-хуки
  const { data: apiNotifications = [], isFetching } = useGetNotificationsQuery(undefined, {
    skip: !open, // грузим только при открытии
  });
  const [markRead] = useMarkNotificationReadMutation();
  const [deleteNotif] = useDeleteNotificationMutation();

  // Redux state
  const notifications = useAppSelector((s) => s.notification.list);

  // при первом открытии — синхронизация API → store
  useEffect(() => {
    if (open && apiNotifications.length) {
      dispatch(setNotifications(apiNotifications));
    }
  }, [open, apiNotifications, dispatch]);

  const handleMarkRead = async (id: number) => {
    try {
      await markRead(id);
      dispatch(markAsRead(id));
    } catch (e) {
      console.error("markRead error", e);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotif(id);
      dispatch(removeNotification(id));
    } catch (e) {
      console.error("deleteNotif error", e);
    }
  };

  const handleMarkAll = async () => {
    // локально все в read
    notifications.forEach((n) => {
      if (!n.is_read) dispatch(markAsRead(n.id));
    });

    // можно добавить PATCH-запрос "mark all read"
    console.log("✅ Marked all notifications as read (local)");
  };

  const handleClearAll = async () => {
    dispatch(clearNotifications());
    console.log("🗑️ Cleared all notifications (local)");
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <>
      {/* 🔔 Иконка */}
      <button className="cursor-pointer relative" onClick={() => setOpen(true)}>
        <Bell
          color="#fff"
          strokeWidth={1.25}
          className="w-6 h-6 transition-transform hover:scale-110"
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3" />
        )}
      </button>

      {/* 💬 Модалка уведомлений */}
      <ModalLayout open={open} onClose={() => setOpen(false)}>
        <div className="p-5 text-white bg-[#1a1f3c] rounded-lg max-h-[600px] overflow-y-auto min-w-[420px]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              🔔 Notifications{" "}
              {connected ? (
                <span className="text-green-400 text-sm">(live)</span>
              ) : (
                <span className="text-gray-400 text-sm">(offline)</span>
              )}
            </h3>

            <div className="flex gap-2">
              <button
                onClick={handleMarkAll}
                className="text-xs px-2 py-1 bg-[#ffffff22] hover:bg-[#ffffff33] rounded"
              >
                Mark all read
              </button>
              <button
                onClick={handleClearAll}
                className="text-xs px-2 py-1 bg-[#ffffff22] hover:bg-[#ffffff33] rounded"
              >
                Clear all
              </button>
            </div>
          </div>

          {/* ⏳ Загрузка */}
          {isFetching ? (
            <div className="flex justify-center items-center py-5 text-gray-400">
              <Loader2 className="animate-spin mr-2" size={18} />
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-gray-400 italic">No notifications yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-[#ffffff22]">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex justify-between items-start py-2 px-1 transition ${
                    n.is_read ? "opacity-70" : "opacity-100"
                  } hover:bg-[#ffffff0a] rounded-md`}
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">{n.title}</p>
                    {n.body && (
                      <p className="text-sm text-gray-300">{n.body}</p>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2 ml-3">
                    {!n.is_read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        title="Mark as read"
                        className="p-1 rounded hover:bg-[#ffffff22]"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(n.id)}
                      title="Delete"
                      className="p-1 rounded hover:bg-[#ffffff22]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ModalLayout>
    </>
  );
};
