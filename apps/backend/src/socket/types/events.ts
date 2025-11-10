// типизация событий для каждого namespace

export interface ChatEvents {
    "new-message": any;
    "user-typing-start": { chatId: string; username?: string };
    "user-typing-stop": { chatId: string; username?: string };
    "edit-message": any;
    "delete-message": { messageId: string };
}

export interface NotificationEvents {
    notification: { type: string; message: string; [key: string]: any };
    "user-online": { userId: string; isOnline: true };
    "user-offline": { userId: string; isOnline: false };
}

export interface JournalEvents {
    "update-into-server": { serverId: string };
    "user-online": number;
    "chat-created": any;
    server_kicked: { serverId: string; reason?: string };
    server_banned: { serverId: string; reason?: string };
}

export interface NamespaceEvents {
    chat: ChatEvents;
    notification: NotificationEvents;
    journal: JournalEvents;
}
