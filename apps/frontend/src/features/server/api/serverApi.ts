import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config";

export const serverApi = createApi({
    reducerPath: "serverApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${config.monoliteUrl}/api`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as {
                auth: { user: { access_token?: string } };
            }; // Type assertion for state
            const token = state.auth.user?.access_token;

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        GetServers: builder.query({
            query: () => ({
                url: `/servers`,
                method: "GET",
            }),
        }),
        CreateSever: builder.mutation({
            query: (data) => ({
                url: `/servers`,
                method: "POST",
                body: data,
            }),
        }),
        GetServersInside: builder.query({
            query: (id) => ({
                url: `/servers/${id}/`,
                method: "GET",
            }),
        }),
        CreateChat: builder.mutation({
            query: ({ id, data }) => ({
                url: `/servers/${id}/chats`,
                method: "POST",
                body: data,
            }),
        }),
        JoinServer: builder.mutation({
            query: (id) => ({
                url: `/servers/${id}/join`,
                method: "POST",
            }),
        }),
        GetServersMembers: builder.query({
            query: (id) => ({
                url: `/servers/${id}/members`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetServersQuery,
    useLazyGetServersQuery,
    useCreateSeverMutation,
    useLazyGetServersInsideQuery,
    useCreateChatMutation,
    useJoinServerMutation,
    useLazyGetServersMembersQuery,
} = serverApi;
