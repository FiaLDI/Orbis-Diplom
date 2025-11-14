import { useLoadServerData } from "./useLoadServerData";
import { useServerSocketHandlers } from "./useServerSocketHandlers";

export function useServerData(
  serverId?: string,
  baseContextId?: string | null,
) {
  const handlers = useLoadServerData({ serverId, issueId: baseContextId });

  const socket = useServerSocketHandlers(handlers, baseContextId);

  return socket;
}
