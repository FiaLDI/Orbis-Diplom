export const linksQueries = {
  GetLinks: (serverId: string) => ({
    url: `/servers/${serverId}/link`,
    method: "GET",
  }),

  CreateLink: (serverId: string) => ({
    url: `/servers/${serverId}/link`,
    method: "POST",
  }),

  DeleteLink: ({ serverId, code }: any) => ({
    url: `/servers/${serverId}/link?code=${code}`,
    method: "DELETE",
  }),
};
