import { testPrisma } from "../setup";
import { vi } from "vitest";

vi.mock("@/lib/db", () => ({
  default: testPrisma,
}));
