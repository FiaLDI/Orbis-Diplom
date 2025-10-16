import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { serverApi } from "../api";
import { server, serverState } from "../types";

const initialState: serverState = {
    isCreatingServer: false,
    isSettingsActive: false,
};

const serverSlice = createSlice({
    name: "server",
    initialState,
    reducers: {
        setActiveServer(state, action: PayloadAction<server | undefined>) {
            state.activeserver = action.payload;
        },
        setServers(state, action: PayloadAction<server[]>) {
            state.servers = action.payload;
        },
        needChange(state) {
            state.messegerChange = true;
        },
        clearChange(state) {
            state.messegerChange = undefined;
        },
        setSettingsActive(state, action: PayloadAction<boolean>) {
            state.isSettingsActive = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Обработка состояний для регистрации и авторизации
        builder
            .addMatcher(
                serverApi.endpoints.GetServers.matchFulfilled,
                (state, action) => {
                    state.servers = action.payload;
                },
            )
            .addMatcher(
                serverApi.endpoints.GetServersMembers.matchFulfilled,
                (state, action) => {
                    if (!state.activeserver) return;
                    state.activeserver = {
                        ...state.activeserver,
                        users: action.payload,
                    };
                },
            )
            .addMatcher(
                serverApi.endpoints.GetServersInside.matchFulfilled,
                (state, action) => {
                    if (!state.activeserver) return;
                    state.activeserver = {
                        ...state.activeserver,
                        ...action.payload,
                    };
                },
            )
            .addMatcher(
                serverApi.endpoints.GetPermissions.matchFulfilled,
                (state, action) => {
                    state.allPermission = action.payload;
                },
            )
            .addMatcher(
                serverApi.endpoints.GetServersRoles.matchFulfilled,
                (state, action) => {
                    if (!state.activeserver) return;
                    state.activeserver = {
                        ...state.activeserver,
                        roles: action.payload,
                    };
                },
            ).addMatcher(
            serverApi.endpoints.UpdateServerRole.matchFulfilled,
            (state, action) => {
                if (!state.activeserver || !state.activeserver.roles) return;
                state.activeserver.roles = state.activeserver.roles.map((role: any) =>
                role.id === action.meta.arg.originalArgs.roleId
                    ? { ...role, ...action.meta.arg.originalArgs.data }
                    : role
                );
            },
            ).addMatcher(
      serverApi.endpoints.UpdateRolePermissions.matchFulfilled,
      (state, action) => {
        if (!state.activeserver || !state.activeserver.roles) return;
        const roleId = action.meta.arg.originalArgs.roleId;
        const permissions = action.meta.arg.originalArgs.permissions;

        state.activeserver.roles = state.activeserver.roles.map((role: any) =>
          role.id === roleId
            ? { ...role, permissions }
            : role
        );
      },
    )
            ;
    },
});

export const {
    setActiveServer,
    setServers,
    needChange,
    clearChange,
    setSettingsActive,
} = serverSlice.actions;

export default serverSlice.reducer;
