import { describe, it, expect, beforeEach, vi } from "vitest";
import { MessageService } from "../../../src/modules/messages/services/message.service";
import { prismaMock } from "../../mocks/prisma.mock";

describe("MessageService.checkMessage", () => {
  let service: MessageService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new MessageService(prismaMock as any, {} as any);
  });

  it("❌ returns falsy check if message not found", async () => {
    prismaMock.messages.findUnique.mockResolvedValue(null);

    const result = await service.checkMessage("msg-1");

    expect(result.check).toBeFalsy();   // ✅ ВАЖНО
    expect(result.checkData).toEqual({});
  });

  it("✅ returns truthy check if message exists", async () => {
    prismaMock.messages.findUnique.mockResolvedValue({
      user_id: "user-1",
      chat_id: "chat-1",
    });

    const result = await service.checkMessage("msg-1");

    expect(result.check).toBeTruthy();  // ✅ ВАЖНО
    expect(result.checkData.chatId).toBe("chat-1");
    expect(result.checkData.userId).toBe("user-1");
  });
});
