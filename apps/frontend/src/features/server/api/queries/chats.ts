export interface CreateChatArgs {
    id: string;
    data: any;
}

export interface DeleteChatArgs {
    id: string;
    chatId: string;
}

export const chatsQueries = {
    CreateChat: ({ id, data }: CreateChatArgs) => ({
        url: `/servers/${id}/chats`,
        method: "POST",
        body: data,
    }),

    DeleteChat: ({ id, chatId }: DeleteChatArgs) => ({
        url: `/servers/${id}/chats/${chatId}`,
        method: "DELETE",
    }),

    GetServersChats: (id: string) => ({
        url: `/servers/${id}/chats`,
        method: "GET",
    }),
};
