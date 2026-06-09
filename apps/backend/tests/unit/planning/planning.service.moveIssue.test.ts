import { describe, it, expect, beforeEach, vi } from "vitest";
import { PlanningService } from "../../../src/modules/planning/services/planning.service";
import { Errors } from "../../../src/common/errors";
import { prismaMock } from "../../mocks/prisma.mock";

describe("PlanningService.moveIssue", () => {
  let service: PlanningService;

  beforeEach(() => {
    vi.clearAllMocks();

    service = new PlanningService(
      prismaMock as any,
      {} as any, // notificationService
      {} as any, // userService
      {} as any  // chatService
    );
  });

  it("❌ cannot move issue under itself", async () => {
    await expect(
      (service as any).moveIssue("issue-1", "issue-1")
    ).rejects.toEqual(
      Errors.conflict("Issue cannot be parent of itself")
    );
  });

  it("❌ cannot move issue under its descendant", async () => {
    const issueId = "11111111-1111-1111-1111-111111111111";
    const descendantId = "22222222-2222-2222-2222-222222222222";

    prismaMock.issue = {
        findUnique: vi.fn()
        // descendant → parent = issueId
        .mockResolvedValueOnce({ parent_id: issueId }),
    } as any;

    await expect(
        (service as any).moveIssue(issueId, descendantId)
    ).rejects.toEqual(
        Errors.conflict("Cannot move issue under its descendant")
    );
    });


  it("✅ moves issue normally", async () => {
    prismaMock.issue = {
      findUnique: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockResolvedValue({
        id: "issue-1",
        parent_id: "issue-2",
      }),
    } as any;

    const result = await (service as any).moveIssue("issue-1", "issue-2");

    expect(prismaMock.issue.update).toHaveBeenCalledWith({
      where: { id: "issue-1" },
      data: { parent_id: "issue-2" },
    });

    expect(result.parent_id).toBe("issue-2");
  });
});
