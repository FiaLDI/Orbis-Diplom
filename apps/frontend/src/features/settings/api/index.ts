import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/config";
import { ProfileInfo, AccountInfo } from "../types";

export const settingsApi = createApi({
    reducerPath: "settingsApi",
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
        updateProfile: builder.mutation<any, { id: string; data: Partial<ProfileInfo> }>({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: data,
            }),
        }),
        updateAccount: builder.mutation<any, { id: string; data: Partial<AccountInfo> }>({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: data,
            }),
        }),
    }),
});

export const { useUpdateAccountMutation, useUpdateProfileMutation } = settingsApi;
