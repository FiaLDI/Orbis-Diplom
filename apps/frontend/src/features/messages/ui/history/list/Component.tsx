import React, { useEffect, useState } from "react";
import { Reply, Pencil, Copy, Trash2, ArrowDown } from "lucide-react";
import { AnimatedContextMenu } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { SingleMessage } from "../messages";
import { AnimatePresence, motion } from "framer-motion";
import { useConfirm } from "@/shared/hooks/confirm/useConfirm";
import { useMessagesListModel } from "@/features/messages/hooks";

export const MessagesList: React.FC = () => {
  const { confirm, modal } = useConfirm();
  const m = useMessagesListModel(confirm);
  const { t } = useTranslation("messages");

  const menuItems = [
    {
      label: t("action.reply"),
      action: m.handleReplyMessage,
      icon: <Reply size={15} />,
    },
    {
      label: t("action.edit"),
      action: m.handleEditMessage,
      icon: <Pencil size={15} />,
    },
    {
      label: t("action.copy"),
      action: m.handleCopyMessage,
      icon: <Copy size={15} />,
    },
    {
      label: t("action.delete"),
      action: m.handleRemoveMessage,
      icon: <Trash2 size={15} />,
      danger: true,
    },
  ];

  return (
    <div className="relative h-full min-h-0">
      <div
        ref={m.containerRef}
        className="h-full overflow-y-auto p-4 flex flex-col gap-3 bg-background/50 text-white min-h-0"
      >
        <AnimatePresence>
          {m.isLoadingMore && (
            <motion.div
              className="flex justify-center items-center py-2 text-sm text-muted-foreground"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="animate-pulse">Загрузка истории...</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div
          ref={m.topRef}
          className="w-full h-[4px] bg-transparent rounded-full opacity-70 -mt-2"
          title="topRef marker"
        />

        {Array.isArray(m.activeHistory) &&
          m.activeHistory.map((message, idx) => (
            <SingleMessage
              key={`single-${message.chatId}-${idx}`}
              message={message}
              onClick={(e) => m.handleContextMenu(e, message)}
              currentUser={m.currentUser}
            />
          ))}

        <div ref={m.bottomRef} />

        <AnimatedContextMenu
          visible={!!m.contextMenu}
          x={m.contextMenu?.x ?? 0}
          y={m.contextMenu?.y ?? 0}
          items={menuItems}
          onClose={m.closeMenu}
          menuRef={m.menuRef}
        />
      </div>

      <AnimatePresence>
        {m.showScrollButton && (
          <motion.div
            className="absolute bottom-4 right-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              onClick={m.handleScrollDown}
              className="rounded-full shadow-lg bg-foreground hover:bg-foreground/90 p-3 text-white flex items-center gap-2"
            >
              <ArrowDown size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {modal}
    </div>
  );
};
