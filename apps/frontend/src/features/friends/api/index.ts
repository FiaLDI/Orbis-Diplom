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

  tagTypes: ["Friends", "Requests"],

  endpoints: (builder) => ({
    getFriend: builder.query({
      query: () => ({
        url: `/friends`,
        method: "GET",
      }),
      providesTags: ["Friends"],
    }),

    getIncomingRequests: builder.query({
      query: () => ({
        url: `/friends/requests?direction=incoming`,
        method: "GET",
      }),
      providesTags: ["Requests"],
    }),

    getOutcomingRequests: builder.query({
      query: () => ({
        url: `/friends/requests?direction=outcoming`,
        method: "GET",
      }),
      providesTags: ["Requests"],
    }),

    sendRequest: builder.mutation({
      query: (id) => ({
        url: `/friends/${id}/invite`,
        method: "POST",
      }),
      invalidatesTags: ["Requests"],
    }),

    confirmFriendRequest: builder.mutation({
      query: (id) => ({
        url: `/friends/${id}/confirm`,
        method: "POST",
      }),
      invalidatesTags: ["Friends", "Requests"],
    }),

    rejectFriendRequest: builder.mutation({
      query: (id) => ({
        url: `/friends/${id}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["Requests"],
    }),

     removeFriend: builder.mutation<void, number>({
      query: (id) => ({ url: `/friends/${id}`, method: "DELETE" }),
    }),
    blockFriend: builder.mutation<void, number>({
      query: (id) => ({
        url: `/friends/${id}/block`,
        method: "POST",
      }),
    }),
    unblockFriend: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/friends/${id}/unblock`,
        method: "POST",
      }),
      invalidatesTags: ["Friends"],
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
  useRemoveFriendMutation,
  useBlockFriendMutation,
  useUnblockFriendMutation
} = friendsApi;
