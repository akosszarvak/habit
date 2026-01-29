import { describe, it, expect, beforeEach, vi } from "vitest";

import "../mocks/prisma";

const mockUser = {
  id: "test-user-id",
  authId: "auth0|test123",
};
const mockGetAuthenticatedUser = vi.fn();

vi.mock("../../lib/utils/auth", () => ({
  getAuthenticatedUser: mockGetAuthenticatedUser,
}));

const { testPrisma } = await import("../setup");

vi.mock("../../lib/db", () => ({
  default: testPrisma,
}));

const { GET, POST } = await import("../../app/api/habits/route");

// To run these tests, you have to patch the @prisma/adapter-better-sqlite3 package
// manualy, or wait for an updated version
describe("GET /api/habits", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await testPrisma.completion.deleteMany();
    await testPrisma.habit.deleteMany();
    await testPrisma.user.deleteMany();
  });

  it("should return 401 if user is not authenticated", async () => {
    mockGetAuthenticatedUser.mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return empty array if user has no habits", async () => {
    await testPrisma.user.create({ data: mockUser });
    mockGetAuthenticatedUser.mockResolvedValue(mockUser);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.habits).toEqual([]);
  });

  it("should return all habits for authenticated user", async () => {
    await testPrisma.user.create({ data: mockUser });
    await testPrisma.habit.createMany({
      data: [
        { name: "Exercise", userId: mockUser.id },
        { name: "Read", userId: mockUser.id },
      ],
    });

    mockGetAuthenticatedUser.mockResolvedValue(mockUser);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.habits).toHaveLength(2);
  });
});
