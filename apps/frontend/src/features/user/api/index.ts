import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config";

export const userApi = createApi({
    reducerPath: "userApi",
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
        GetChatsUsers: builder.query({
            query: (id) => ({
                url: `/users/${id}/chats`,
                method: "GET",
            }),
        }),
        CreateChatUsers: builder.mutation({
            query: (data) => ({
                url: `/chats`,
                method: "POST",
                body: data,
            }),
        }),
        getFastInfoUserFromServer: builder.query({
            query: (id) => ({
                url: `/userserver/${id}/`,
                method: "GET",
            }),
        }),
        getInfoUser: builder.query({
            query: (id) => ({
                url: `/users/${id}/`,
                method: "GET",
            }),
        }),
        startChatting: builder.mutation({
            query: (id) => ({
                url: `/chats/start/${id}`,
                method: "POST",
            }),
        }),
        getUserbyName: builder.query({
            query: (name) => ({
                url: `/search/users?q=${name}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetChatsUsersQuery,
    useLazyGetChatsUsersQuery,
    useCreateChatUsersMutation,
    useGetFastInfoUserFromServerQuery,
    useGetInfoUserQuery,
    useLazyGetInfoUserQuery,
    useStartChattingMutation,
    useLazyGetUserbyNameQuery,
} = userApi;
