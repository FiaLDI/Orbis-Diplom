import { Server } from "socket.io";
import { ENVCONFIG } from "@/config";
import { chatSocket } from "./chat";
import { journalSocket } from "./journal";
import { notificationSocket } from "./notification";
import { authenticateSocket } from "./middleware/authenticateSocket";
import { setIo, setNamespace } from "./registry";
import { AuthenticatedSocket } from "./types";

export const initSockets = (server: any) => {
    const io = new Server(server, {
        cors: { origin: ENVCONFIG.FRONTENDADDRES },
    });
    setIo(io);

    const namespaces = {
        chat: io.of("/chat"),
        journal: io.of("/journal"),
        notification: io.of("/notification"),
    };

    for (const [name, ns] of Object.entries(namespaces)) {
        // 🧠 авторизация перед подключением
        ns.use(authenticateSocket);

        ns.on("connection", (socket) => {
            const s = socket as AuthenticatedSocket;

            switch (name) {
                case "chat":
                    chatSocket(ns, s);
                    break;
                case "journal":
                    journalSocket(ns, s);
                    break;
                case "notification":
                    notificationSocket(ns, s);
                    break;
            }
        });

        setNamespace(name, ns);
    }

    console.log("🧩 Socket namespaces ready:", Object.keys(namespaces).join(", "));
    return io;
};
