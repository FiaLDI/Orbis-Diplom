import { vi } from "vitest";

export const prismaMock = {
  users: {
    findUnique: vi.fn(),
  },

  chats: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },

  chat_users: {
    createMany: vi.fn(),
    deleteMany: vi.fn(),
  },

  messages: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },

  messages_content: {
    findMany: vi.fn(),
    deleteMany: vi.fn(),
    createMany: vi.fn(),
  },

  content: {
    create: vi.fn(),
    deleteMany: vi.fn(),
  },

  issue: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },


  $transaction: vi.fn(),
};
