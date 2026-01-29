import { vi } from "vitest";

export const mockUser = {
  id: "test-user-id",
  authId: "auth0|test123",
};

export const mockGetAuthenticatedUser = vi.fn();

// Mock the auth module
vi.mock("@/lib/utils/auth", () => ({
  getAuthenticatedUser: () => mockGetAuthenticatedUser(),
}));
