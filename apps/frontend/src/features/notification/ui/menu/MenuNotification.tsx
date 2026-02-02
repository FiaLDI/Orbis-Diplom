import React from "react";
import { Bell, Check, Trash2, Loader2 } from "lucide-react";
import { ModalLayout } from "@/shared";
import { Props } from "./interface";
import { ActionAllButton } from "../../ui/button/ActionAllButton";
import { ActionButton } from "../../ui/button/ActionButton";
import { NotificationHead } from "../../ui/layout/NotificationHead";
import { NotificationLayout } from "../../ui/layout/NotificationLayout";
import { NotificationItemView } from "../../ui/view/NotificationView";
import { useNotificationModel } from "../../hooks/model/useNotificationModel";

export const MenuNotification: React.FC<Props> = ({ connected }) => {
  const {
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
  } = useNotificationModel(connected);

  return (
    <>
      <button className="cursor-pointer relative" onClick={() => setOpen(true)}>
        <Bell
          color="#fff"
          strokeWidth={1.25}
          className="w-8 h-8 transition-transform hover:scale-110"
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3" />
        )}
      </button>

      <ModalLayout open={open} onClose={() => setOpen(false)}>
        <NotificationLayout
          head={
            <NotificationHead
              connected={connected}
              title={t("title")}
              online={t("status.1")}
              offline={t("status.0")}
            />
          }
          action={
            <>
              <ActionAllButton
                handler={handleMarkAll}
                title={t("action.readall")}
              />

              <ActionAllButton
                handler={handleClearAll}
                title={t("action.clearall")}
              />
            </>
          }
          view={
            <>
              {isFetching ? (
                <div className="flex justify-center items-center py-5 text-gray-400">
                  <Loader2 className="animate-spin mr-2" size={18} />
                  {t("loading")}
                </div>
              ) : notifications.length === 0 ? (
                <p className="text-gray-400 italic">{t("empty")}</p>
              ) : (
                <div className="flex flex-col divide-y divide-[#ffffff22] p-2">
                  {notifications.map((n) => (
                    <NotificationItemView
                      key={n.id}
                      n={n}
                      ActionRead={
                        <>
                          {!n.is_read && (
                            <ActionButton
                              handler={() => handleMarkRead(n.id)}
                              title={t("action.titleread")}
                            >
                              <Check size={14} />
                            </ActionButton>
                          )}
                        </>
                      }
                      ActionDelete={
                        <ActionButton
                          handler={() => handleDelete(n.id)}
                          title={t("action.titledel")}
                        >
                          <Trash2 size={14} />
                        </ActionButton>
                      }
                    />
                  ))}
                </div>
              )}
            </>
          }
        />
      </ModalLayout>
    </>
  );
};
