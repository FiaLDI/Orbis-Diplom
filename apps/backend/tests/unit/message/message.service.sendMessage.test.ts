import { describe, it, expect, beforeEach, vi } from "vitest";

// 🔥 Мокаем ДО импорта сервиса
vi.mock("../../../src/socket/registry", () => ({
  debugRoom: vi.fn(),
  emitTo: vi.fn(),
}));

import { emitTo } from "../../../src/socket/registry";
import { MessageService } from "../../../src/modules/messages/services/message.service";
import { prismaMock } from "../../mocks/prisma.mock";

describe("MessageService.sendMessage", () => {
  let service: MessageService;

  beforeEach(() => {
    vi.clearAllMocks();

    service = new MessageService(
      prismaMock as any,
      {
        getProfileById: vi.fn().mockResolvedValue({
          toPublicJSON: () => ({
            id: "user-1",
            username: "alice",
            avatar_url: null,
          }),
        }),
      } as any
    );
  });

  it("✅ emits socket event after sending message", async () => {
    prismaMock.content.create.mockResolvedValue({
      id: "content-1",
      text: "Hello",
      url: null,
    });

    prismaMock.messages.create.mockResolvedValue({
      id: "msg-1",
      chat_id: "chat-1",
      user_id: "user-1",
      reply_to_id: null,
      created_at: new Date(),
      is_edited: false,
    });

    await service.sendMessage({
      id: "user-1",
      chatId: "chat-1",
      content: [
        {
          id: "content-1",
          type: "text",
          text: "Hello",
        },
      ],
    });

    expect(emitTo).toHaveBeenCalledWith(
      "chat",
      "chat_chat-1",
      "new-message",
      expect.any(Object)
    );
  });
});
