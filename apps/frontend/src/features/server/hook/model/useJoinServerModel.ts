import { SubmitHandler, useForm } from "react-hook-form";
import { useJoinServerMutation } from "@/features/server/api";
import { JoinServerFormData } from "@/features/server/types";
import { useEmitServerUpdate } from "..";

export function useJoinServerModel(setOpen: any) {
  const [joinServer, joinState] = useJoinServerMutation();
  const emitServerUpdate = useEmitServerUpdate();

  const joinForm = useForm<JoinServerFormData>({
    defaultValues: { serverId: "" },
  });

  const onJoin: SubmitHandler<JoinServerFormData> = async (data) => {
    if (!data.serverId.trim()) return;
    try {
      await joinServer(data.serverId).unwrap();
      joinForm.reset();
      setOpen(false);
      emitServerUpdate("members", data.serverId);
    } catch (err) {
      console.error("Failed to join server:", err);
    }
  };

  return {
    joinForm,
    onJoin,
    joinState,
  };
}
