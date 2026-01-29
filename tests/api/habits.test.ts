import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST } from "@/app/api/habits/route";
import { testPrisma } from "../setup";
import { mockUser, mockGetAuthenticatedUser } from "../mocks/auth";
import "../mocks/prisma";

describe("GET /api/habits", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if user is not authenticated", async () => {
    mockGetAuthenticatedUser.mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });
});
