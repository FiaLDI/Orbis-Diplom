import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config";

export const notificationApi = createApi({
    reducerPath: "notificationApi",
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
    tagTypes: ["Notification"],
    endpoints: (builder) => ({
        getNotifications: builder.query<any[], void>({
            query: () => "/notifications",
            providesTags: ["Notification"],
        }),
        markNotificationRead: builder.mutation<void, number>({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PUT",
            }),
            invalidatesTags: ["Notification"],
        }),
        deleteNotification: builder.mutation<void, number>({
            query: (id) => ({
                url: `/notifications/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notification"],
        }),
        markAllNotificationRead: builder.mutation({
            query: () => ({
                url: `/notifications/read`,
                method: "PUT",
            }),
            invalidatesTags: ["Notification"],
        }),
        deleteAllNotification: builder.mutation({
            query: () => ({
                url: `/notifications/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notification"],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkNotificationReadMutation,
    useDeleteNotificationMutation,
    useMarkAllNotificationReadMutation,
    useDeleteAllNotificationMutation,
} = notificationApi;
