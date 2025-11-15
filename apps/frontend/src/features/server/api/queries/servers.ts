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

  GetServersInside: (id: string) => ({
    url: `/servers/${id}/`,
    method: "GET",
  }),

  DeleteServer: (id: string) => ({
    url: `/servers/${id}/`,
    method: "DELETE",
  }),

  JoinServer: (id: string) => ({
    url: `/servers/join?code=${id}`,
    method: "POST",
  }),

  UpdateServer: ({
    id,
    data,
  }: {
    id: string;
    data: { name: string; avatar_url: string };
  }) => ({
    url: `/servers/${id}`,
    method: "PATCH",
    body: data,
  }),
};
