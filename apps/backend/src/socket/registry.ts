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
/**
 * Типизированная отправка событий в комнату / пользователю.
 * Делает имя namespace устойчивым (поддерживает 'chat' и '/chat'),
 * и если namespace не зарегистрирован вручную, берёт io.of('/chat') напрямую.
 */
export const emitTo = <
  N extends keyof NamespaceEvents,
  E extends keyof NamespaceEvents[N]
>(
  namespace: N,
  room: string,
  event: E,
  payload: NamespaceEvents[N][E]
) => {
  const nsKey = String(namespace);
  const normalized = nsKey.startsWith("/") ? nsKey : `/${nsKey}`;

  // Пытаемся взять из словаря, иначе берём напрямую из io
  const ns =
    namespaces.get(nsKey) ??
    namespaces.get(normalized) ??
    getIo().of(normalized);

  ns.to(room).emit(event as string, payload);
};

export const debugRoom = async (namespace: string, room: string) => {
  const ns = getIo().of(namespace.startsWith("/") ? namespace : `/${namespace}`);
  const sockets = await ns.in(room).fetchSockets();
  console.log(`[${namespace}] room=${room} size=${sockets.length}`, sockets.map(s => s.id));
};

/**
 * Быстрая отправка типизированного события конкретному пользователю
 */
export const emitToUser = <N extends keyof NamespaceEvents, E extends keyof NamespaceEvents[N]>(
    namespace: N,
    userId: string,
    event: E,
    payload: NamespaceEvents[N][E]
) => {
    emitTo(namespace, `user:${userId}`, event, payload);
};
