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
        getChatInfo: builder.query({
            query: (id) => ({
                url: `/chat/${id}`,
                method: "GET",
            }),
        }),
        GetMessages: builder.query({
            query: ({id, offset=0}) => ({
                url: `/chats/${id}/messages?offset=${offset}`,
                method: "GET",
            }),
        }),
        GetMessage: builder.query({
            query: ({chat_id, id}) => ({
                url: `/message?chat_id=${chat_id}&message_id=${id}`,
                method: "GET",
            }),
        }),
        CreateMessages: builder.mutation({
            query: ({id, data}) => ({
                url: `/chats/${id}/messages`,
                method: "POST",
                body: data,
            }),
        }),
        RemoveMessage: builder.mutation({
            query: ({chat_id, id}) => ({
                url: `/message/?chat_id=${chat_id}&message_id=${id}`,
                method: "DELETE",

            })
        }),
        EditMessage: builder.mutation({
            query: ({chat_id, id, content}) => ({
                url: `/message/?chat_id=${chat_id}&message_id=${id}`,
                method: "PUT",
                body: {content}
            })
        })

    }),
});

export const {
    useCreateMessagesMutation,
    useLazyGetChatInfoQuery,
    useLazyGetMessagesQuery,
    useGetChatInfoQuery,
    useEditMessageMutation,
    useLazyGetMessageQuery,
    useRemoveMessageMutation
} = messageApi;
