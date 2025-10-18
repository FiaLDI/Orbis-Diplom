import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.monoliteUrl}/api`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as {
        auth: { user: { access_token?: string } };
      };
      const token = state.auth.user?.access_token;

      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ["Chat"], // 👈 добавляем тип кэша

  endpoints: (builder) => ({
    getChatInfo: builder.query({
      query: (id) => ({
        url: `/chats/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Chat", id }],
    }),

    updateChat: builder.mutation({
      query: ({ id, data }) => ({
        url: `/chats/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Chat", id }], // 👈 триггерит обновление getChatInfo
    }),
  }),
});

export const {
  useLazyGetChatInfoQuery,
  useGetChatInfoQuery,
  useUpdateChatMutation,
} = chatApi;
