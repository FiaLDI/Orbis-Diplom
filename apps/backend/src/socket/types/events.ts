// типизация событий для каждого namespace

export interface ChatEvents {
    "new-message": any;
    "user-typing-start": { chatId: string; username?: string };
    "user-typing-stop": { chatId: string; username?: string };
    "edit-message": any;
    "delete-message": { messageId: number };
}

export interface NotificationEvents {
    notification: { type: string; message: string; [key: string]: any };
    "user-online": { userId: number; isOnline: true };
    "user-offline": { userId: number; isOnline: false };
}

export interface JournalEvents {
    "update-into-server": { serverId: number };
    "user-online": number;
    "chat-created": any;
    server_kicked: { serverId: number; reason?: string };
    server_banned: { serverId: number; reason?: string };
}

export interface NamespaceEvents {
    chat: ChatEvents;
    notification: NotificationEvents;
    journal: JournalEvents;
}
