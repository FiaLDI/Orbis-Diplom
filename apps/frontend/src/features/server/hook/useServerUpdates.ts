import { useEffect } from "react";
import { addAction } from "@/features/action";

export function useServerUpdates(socket: any, serverId: number | undefined, trigger: any, dispatch: any) {
  useEffect(() => {
    if (!socket || !serverId) return;

    const updateServer = () => {
      trigger(serverId);
      dispatch(addAction({
        id: Date.now(),
        type: "SUCCESS",
        text: "Success updated",
        duration: 3000,
      }));
    };

    socket.on("update-into-server", updateServer);
    return () => socket.off("update-into-server", updateServer);
  }, [socket, serverId, trigger, dispatch]);
}
