import { Prisma } from "@prisma/client";

const roleServerWithRelations = Prisma.validator<Prisma.role_serverDefaultArgs>()({
  include: {
    role_permission: { include: { permission: true } },
    members: {
      include: {
        user_server: { select: { user_id: true } },
      },
    },
  },
});

export type RoleServerWithRelations = Prisma.role_serverGetPayload<
  typeof roleServerWithRelations
>;
