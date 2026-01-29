import { beforeAll, afterAll, beforeEach } from "vitest";
import { PrismaClient } from "../lib/generated/prisma/client";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const db = new Database(":memory:");

// @ts-expect-error there is an error here due
// to having to patch @prisma/adapter-better-sqlite3 manually
const adapter = new PrismaBetterSqlite3(db);
export const testPrisma = new PrismaClient({ adapter });

beforeAll(async () => {
  // Run migrations
  const { execSync } = require("child_process");
  execSync("npx prisma migrate deploy", {
    env: { ...process.env, DATABASE_URL: "file::memory:" },
  });
});

beforeEach(async () => {
  // Clear database before each test
  await testPrisma.completion.deleteMany();
  await testPrisma.habit.deleteMany();
  await testPrisma.user.deleteMany();
});

afterAll(async () => {
  await testPrisma.$disconnect();
});
