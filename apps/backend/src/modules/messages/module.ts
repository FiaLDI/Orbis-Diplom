import express from "express";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import type { AuthMiddleware } from "@/middleware/auth.middleware";
import { MessageController } from ".";

export const messageModule = () => {
    const router = express.Router();

    const controller = container.get<MessageController>(TYPES.MessageController);
    const auth = container.get<AuthMiddleware>(TYPES.AuthMiddleware);

    router.get(
        "/chats/:id/messages",
        auth.handle.bind(auth),
        controller.getPersonalMessages.bind(controller)
    );
    router.post(
        "/chats/:id/messages",
        auth.handle.bind(auth),
        controller.sendMessages.bind(controller)
    );
    router.get("/:id", auth.handle.bind(auth), controller.getMessageById.bind(controller));
    router.put("/:id", auth.handle.bind(auth), controller.editMessage.bind(controller));
    router.delete("/:id", auth.handle.bind(auth), controller.deleteMessage.bind(controller));

    return router;
};
