import { Prisma } from "@prisma/client";

const usersChatsWithRelations = Prisma.validator<Prisma.chatsDefaultArgs>()({
    include: {
        chat_users: true,
    },
});

export type usersChatsWithRelations = Prisma.chatsGetPayload<typeof usersChatsWithRelations>;
