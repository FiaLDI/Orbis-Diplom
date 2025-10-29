import { Prisma } from "@prisma/client";
import { UserProfile } from "@/modules/users/entity/user.profile";

export class MessageListEntity {
  constructor(
    private messages: Prisma.messagesGetPayload<{
      include: {
        messages_content: {
          include: {
            content: { 
                select: { id: true; text: true; url: true } 
            };
            
          };
        };
      };
    }>[]
  ) {}

  getUserIds() {
    return [...new Set(this.messages.map(m => m.user_id).filter((id): id is number => !!id))];
  }

  toJSON(profilesMap: Map<number, UserProfile>) {
    return this.messages.map(m => {
      const profile = profilesMap.get(m.user_id ?? -1);

      return {
        id: m.id,
        chat_id: m.chat_id,
        created_at: m.created_at,
        contents: m.messages_content.map(mc => ({
          id: mc.content.id,
          text: mc.content.text,
          url: mc.content.url,
          type: mc.type ?? "text",
          size: mc.size ?? null, 
          uploaded_at: mc.uploaded_at,
        })),
        user: profile ? profile.toPublicJSON() : null,
      };
    });
  }
}
