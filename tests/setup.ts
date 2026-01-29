import { beforeAll, afterAll, beforeEach } from "vitest";
import { PrismaClient } from "../lib/generated/prisma/client";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const TEST_DB_PATH = path.join(process.cwd(), "prisma", "test.db");

const db = new Database(":memory:");

// @ts-expect-error there is an error here due
// to having to patch @prisma/adapter-better-sqlite3 manually
const adapter = new PrismaBetterSqlite3(db);
export const testPrisma = new PrismaClient({ adapter });

beforeAll(async () => {
  // Run migrations

  // Run migrations
  process.env.DATABASE_URL = "file::memory:";
  try {
    execSync("npx prisma db push --skip-generate --force-reset", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: "file::memory:" },
    });
  } catch (error) {
    console.error("Failed to push schema:", error);
  }
});

// beforeEach(async () => {
//   // Clear database before each test
//   await testPrisma.completion.deleteMany();
//   await testPrisma.habit.deleteMany();
//   await testPrisma.user.deleteMany();
// });

afterAll(async () => {
  await testPrisma.$disconnect();
  db.close();

  // Clean up test database file if it exists
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
});
