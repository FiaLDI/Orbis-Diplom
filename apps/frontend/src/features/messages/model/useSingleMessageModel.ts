import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  leaveEditMode,
  updateMessageInHistory,
  useEditMessageMutation,
} from "@/features/messages";
import { resetUpload, uploadFiles } from "@/features/upload";
import type { MessageContent } from "@/features/messages/types";

export function useSingleMessageModel(message: any, currentUser?: any) {
  const dispatch = useAppDispatch();
  const editmode = useAppSelector((s) => s.message.editmode);
  const allHistories = useAppSelector((s) => s.message.histories);
  const activeChatId = useAppSelector((s) => s.chat.activeChat?.id);
  const [updateMessage] = useEditMessageMutation();

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing =
    editmode?.enabled && editmode.messagesId === String(message.id);

  const [editText, setEditText] = useState(message.content?.[0]?.text ?? "");
  const [attachedFiles, setAttachedFiles] = useState<MessageContent[]>(
    message.content?.filter((c: { type: string }) => c.type !== "text") || [],
  );

  const repliedMsg = useMemo(() => {
    if (!message.replyToId || !activeChatId) return null;
    const messages = allHistories?.[activeChatId] ?? [];
    return messages.find((m) => m.id === message.replyToId) ?? null;
  }, [message.replyToId, activeChatId, allHistories]);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleFilesSelect = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    const uploadedUrls = await dispatch(uploadFiles(arr)).unwrap();
    const mapped: MessageContent[] = uploadedUrls.map((url) => {
      const name = url.split("/").pop() || "file";
      const type: "image" | "file" = /\.(jpg|jpeg|png|gif|webp)$/i.test(name)
        ? "image"
        : "file";
      return { id: crypto.randomUUID(), type, url, text: name };
    });
    setAttachedFiles((prev) => [...prev, ...mapped]);
  };

  const handleSave = async () => {
    const textContent: MessageContent[] = editText.trim()
      ? [{ id: crypto.randomUUID(), type: "text", text: editText.trim() }]
      : [];
    const content: MessageContent[] = [...textContent, ...attachedFiles];
    if (!content.length) return dispatch(leaveEditMode());

    try {
      await updateMessage({ id: message.id, content }).unwrap();
      dispatch(updateMessageInHistory({ ...message, content, isEdited: true }));
      dispatch(resetUpload());
    } catch (e) {
      console.error("Ошибка при обновлении:", e);
    }
    dispatch(leaveEditMode());
  };

  const handleCancel = () => {
    dispatch(leaveEditMode());
    setEditText(message.content?.[0]?.text ?? "");
    setAttachedFiles(
      message.content?.filter((c: { type: string }) => c.type !== "text") || [],
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleFilesSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return {
    isEditing,
    editText,
    setEditText,
    attachedFiles,
    setAttachedFiles,
    repliedMsg,
    handleFilesSelect,
    handleSave,
    handleCancel,
    handleDrop,
    handleDragOver,
    inputRef,
    fileInputRef,
  };
}
