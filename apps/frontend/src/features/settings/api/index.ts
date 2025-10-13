import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config";

export const settingsApi = createApi({
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
        updateProfile: builder.mutation({
            query: (id) => ({
                url: `/user`,
                method: "PUT",
            }),
        }),
        updateAccount: builder.mutation({
            query: (id) => ({
                url: `/user`,
                method: "PUT",
            }),
        }),
    }),
});

export const {
    useUpdateAccountMutation,
    useUpdateProfileMutation
} = settingsApi;
