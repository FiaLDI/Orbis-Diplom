import { vi } from "vitest";

export const debugRoomMock = vi.fn();
export const emitToMock = vi.fn();

vi.mock("../../../src/socket/registry", () => ({
  debugRoom: debugRoomMock,
  emitTo: emitToMock,
}));
