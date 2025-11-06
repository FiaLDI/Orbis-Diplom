export interface CreateServerArgs {
    data: any;
}

export const serversQueries = {
    GetServers: () => ({
        url: `/servers`,
        method: "GET",
    }),

    CreateServer: (data: any) => ({
        url: `/servers`,
        method: "POST",
        body: data,
    }),

    GetServersInside: (id: number) => ({
        url: `/servers/${id}/`,
        method: "GET",
    }),

    DeleteServer: (id: number) => ({
        url: `/servers/${id}/`,
        method: "DELETE",
    }),

    JoinServer: (id: number) => ({
        url: `/servers/${id}/join`,
        method: "POST",
    }),

    UpdateServer: ({id, data}: {id: number, data: {name: string, avatar_url: string}}) => ({
        url: `/servers/${id}`,
        method: "PATCH",
        body: data
    }),
};
