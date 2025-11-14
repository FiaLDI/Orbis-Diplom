import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useMemo } from "react";
import { chat, setActiveChat, useUpdateChatMutation } from "../..";
import { ChatEditFormData } from "../components/chatlist/chatitem/edit/interface";
import { SubmitHandler, useForm } from "react-hook-form";
import { setChatName } from "@/features/user";
import { useEmitServerUpdate } from "@/features/server";

export function useChatEditModel(
  initialData: any,
  editQuery: any,
  onClose: any,
  onSave: any,
  activeServerId?: string,
  issueId?: string | null,
) {
  const [updateChat, { isLoading, error }] = useUpdateChatMutation();
  const dispatch = useAppDispatch();
  const emitUpdate = useEmitServerUpdate();

  const form = useForm<ChatEditFormData>({
    defaultValues: {
      name: initialData?.name ?? "",
    },
  });

  const onSubmit: SubmitHandler<ChatEditFormData> = async (data) => {
    if (!data.name.trim()) return;

    try {
      if (editQuery) {
        if (!activeServerId || !issueId) return;
        editQuery({
          serverId: activeServerId,
          issueId,
          chatId: initialData.id,
          data,
        });

        emitUpdate("issue", activeServerId);
        onSave?.();
        return;
      }

      await updateChat({
        id: initialData.id,
        data,
      }).unwrap();

      dispatch(setChatName({ name: data.name.trim(), id: initialData.id }));

      onSave?.();
    } catch (err) {
      console.error("Failed to update chat:", err);
    } finally {
      onClose();
    }
  };

  return {
    onSubmit: onSubmit,
    isLoadingUpdate: isLoading,
    errorUpdate: error,
    form,
  };
}
