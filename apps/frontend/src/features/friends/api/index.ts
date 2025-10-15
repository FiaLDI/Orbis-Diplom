import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config";

export const friendsApi = createApi({
    reducerPath: "friendsApi",
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
        getFriend: builder.query({
            query: () => ({
                url: `/friends`,
                method: "GET",
            }),
        }),
        getIncomingRequests: builder.query({
            query: () => ({
                url: `/friends/requests?direction=incoming`,
                method: "GET",
            }),
        }),
        getOutcomingRequests: builder.query({
            query: () => ({
                url: `/friends/requests?direction=outcoming`,
                method: "GET",
            }),
        }),
        sendRequest: builder.mutation({
            query: (id) => ({
                url: `/friends/${id}/invite`,
                method: "POST",
            }),
        }),
        confirmFriendRequest: builder.mutation({
            query: (id) => ({
                url: `/friend/${id}/confirm`,
                method: "POST",
            }),
        }),
        rejectFriendRequest: builder.mutation({
            query: (id) => ({
                url: `/friend/${id}/reject`,
                method: "POST",
            }),
        }),
    }),
});

export const {
    useSendRequestMutation,
    useGetFriendQuery,
    useLazyGetFriendQuery,
    useLazyGetOutcomingRequestsQuery,
    useLazyGetIncomingRequestsQuery,
    useConfirmFriendRequestMutation,
    useRejectFriendRequestMutation,
} = friendsApi;
