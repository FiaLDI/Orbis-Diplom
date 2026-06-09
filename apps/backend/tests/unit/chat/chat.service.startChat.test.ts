import { describe, it, expect, beforeEach, vi } from "vitest";
import { ChatService } from "../../../src/modules/chat/services/chat.service";
import { Errors } from "../../../src/common/errors";
import { prismaMock } from "../../mocks/prisma.mock";

describe("ChatService.startChat", () => {
  let service: ChatService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ChatService(prismaMock as any);
  });

  it("❌ cannot start chat with yourself", async () => {
    const result = await service.startChat("user-1", "user-1");

    expect(result).toEqual(
      Errors.conflict("Cannot start chat with yourself")
    );
  });

  it("❌ returns error if user not found", async () => {
    prismaMock.users.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ username: "bob" });

    const result = await service.startChat("user-1", "user-2");

    expect(result).toEqual(
      Errors.notFound("User not found")
    );
  });

  it("❌ returns error if chat already exists", async () => {
    prismaMock.users.findUnique
      .mockResolvedValueOnce({ username: "alice" })
      .mockResolvedValueOnce({ username: "bob" });

    prismaMock.chats.findFirst.mockResolvedValue({ id: "chat-1" });

    const result = await service.startChat("user-1", "user-2");

    expect(result).toEqual(
      Errors.conflict("Chat already exists")
    );
  });

  it("✅ creates chat and returns chat id", async () => {
    prismaMock.users.findUnique
      .mockResolvedValueOnce({ username: "alice" })
      .mockResolvedValueOnce({ username: "bob" });

    prismaMock.chats.findFirst.mockResolvedValue(null);

    prismaMock.$transaction.mockImplementation(async (cb: any) => {
      return cb({
        chats: {
          create: vi.fn().mockResolvedValue({ id: "chat-123" }),
        },
        chat_users: {
          createMany: vi.fn(),
        },
      });
    });

    const result = await service.startChat("user-1", "user-2");

    expect(result).toBe("chat-123");
    expect(prismaMock.$transaction).toHaveBeenCalledOnce();
  });
});
