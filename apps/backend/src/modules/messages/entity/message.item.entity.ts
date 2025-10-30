import { BaseMessageEntity } from "./abstract/base.message.entity";
import type { content, messages } from "@prisma/client";
import type { UserProfile } from "@/modules/users/entity/user.profile";

export class MessageItemEntity extends BaseMessageEntity {
  constructor(message: messages, profile: UserProfile, contentRows: content[]) {
    super(message, profile, contentRows);
  }

  static normalizeContent(
    createdContent: {
      id: string;
      type: "text" | "image" | "file" | "video" | "audio";
      text?: string | null;
      url?: string | null;
    }[]
  ) {
    return createdContent.map((c) => ({
      id: c.id,
      type: c.type,
      text: c.text ?? null,
      url: c.url ?? null,
    }));
  }
}
