import { Prisma } from "@prisma/client";

const serverChatsWithRelations = Prisma.validator<Prisma.chatsDefaultArgs>()({
  include: {
    server_chats: true
  }
});

export type serverChatWithRelations = Prisma.chatsGetPayload<
  typeof serverChatsWithRelations
>;
