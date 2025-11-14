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
    getMessages: builder.query<any[], { id: string; cursor?: string }>({
      query: ({ id, cursor }) => ({
        url: cursor
          ? `/messages/chats/${id}/messages?cursor=${cursor}`
          : `/messages/chats/${id}/messages`,
        method: "GET",
      }),
      transformResponse: (resp: { message: string; data: any[] }) => resp.data,
    }),

    GetMessage: builder.query({
      query: ({ chatId, id }) => ({
        url: `/message?chat_id=${chatId}&message_id=${id}`,
        method: "GET",
      }),
    }),
    createMessage: builder.mutation({
      query: ({ chatId, content, replyToId }) => ({
        url: `/messages/chats/${chatId}/messages`,
        method: "POST",
        body: { chatId, content, replyToId },
      }),
    }),
    RemoveMessage: builder.mutation({
      query: ({ chatId, id }) => ({
        url: `/messages/${id}`,
        method: "DELETE",
      }),
    }),
    EditMessage: builder.mutation({
      query: ({ chatId, id, content }) => ({
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
