import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../../config";

export const messageApi = createApi({
    reducerPath: "messageApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${config.monoliteUrl}/api`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as {
                auth: { user: { access_token?: string } };
            };
            const token = state.auth.user?.access_token;

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getMessages: builder.query({
            query: ({ id, offset = 0 }) => ({
                url: `/messages/chats/${id}/messages?offset=${offset}`,
                method: "GET",
            }),
        }),
        GetMessage: builder.query({
            query: ({ chat_id, id }) => ({
                url: `/message?chat_id=${chat_id}&message_id=${id}`,
                method: "GET",
            }),
        }),
        createMessage: builder.mutation({
            query: ({ chat_id, content, reply_to_id }) => ({
                url: `/messages/chats/${chat_id}/messages`,
                method: "POST",
                body: { chat_id, content, reply_to_id },
            }),
        }),
        RemoveMessage: builder.mutation({
            query: ({ chat_id, id }) => ({
                url: `/messages/${id}`,
                method: "DELETE",
            }),
        }),
        EditMessage: builder.mutation({
            query: ({ chat_id, id, content }) => ({
                url: `/messages/${id}`,
                method: "PUT",
                body: { content },
            }),
        }),
    }),
});

export const {
    useCreateMessageMutation,
    useLazyGetMessagesQuery,
    useEditMessageMutation,
    useLazyGetMessageQuery,
    useRemoveMessageMutation,
} = messageApi;
