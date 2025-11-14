import { Server, Namespace } from "socket.io";
import { NamespaceEvents } from "./types/events";

let io: Server | null = null;
const namespaces = new Map<string, Namespace>();

export const setIo = (instance: Server) => {
    io = instance;
};

export const getIo = (): Server => {
    if (!io) throw new Error("Socket.IO not initialized yet!");
    return io;
};

export const setNamespace = (name: string, ns: Namespace) => {
    namespaces.set(name, ns);
};

export const getNamespace = <N extends keyof NamespaceEvents>(name: N): Namespace => {
    const ns = namespaces.get(name);
    if (!ns) throw new Error(`Namespace '${String(name)}' not initialized!`);
    return ns;
};

/**
 * Типизированная отправка событий в комнату / пользователю.
 */
export const emitTo = <N extends keyof NamespaceEvents, E extends keyof NamespaceEvents[N]>(
    namespace: N,
    room: string,
    event: E,
    payload: NamespaceEvents[N][E]
) => {
    const ns = getNamespace(namespace);
    ns.to(room).emit(event as string, payload);
};

/**
 * Быстрая отправка типизированного события конкретному пользователю
 */
export const emitToUser = <N extends keyof NamespaceEvents, E extends keyof NamespaceEvents[N]>(
    namespace: N,
    userId: number,
    event: E,
    payload: NamespaceEvents[N][E]
) => {
    emitTo(namespace, `user_${userId}`, event, payload);
};
