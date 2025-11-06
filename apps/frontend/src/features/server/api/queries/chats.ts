export interface CreateChatArgs {
    id: number;
    data: any;
}

export interface DeleteChatArgs {
    id: number;
    chatId: number;
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

    GetServersChats: (id: number) => ({
        url: `/servers/${id}/chats`,
        method: "GET",
    }),
};
