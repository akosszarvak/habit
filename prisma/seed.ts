import { PrismaClient, Prisma } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";

import "dotenv/config";

const db = new Database("./prisma/dev.db");
const adapter = new PrismaBetterSqlite3(db);

const prisma = new PrismaClient({ adapter });

const users: Prisma.UserCreateInput[] = [
  { authId: "auth_alice", id: "user_1" },
  { authId: "auth_bob", id: "user_2" },
];

const habits: Prisma.HabitCreateInput[] = [
  {
    name: "Drink water",
    userId: "user_1",
    createdAt: new Date(),
    completions: {
      create: [
        { date: new Date("2026-01-01") },
        { date: new Date("2026-01-02") },
        { date: new Date("2026-01-03") },
      ],
    },
  },
  {
    name: "Morning run",
    userId: "user_1",
    createdAt: new Date(),
    completions: {
      create: [
        { date: new Date("2026-01-01") },
        { date: new Date("2026-01-03") },
      ],
    },
  },
  {
    name: "Read 30 min",
    userId: "user_2",
    createdAt: new Date(),
    completions: {
      create: [{ date: new Date("2026-01-02") }],
    },
  },
];
export async function main() {
  // clear out old data (optional)
  await prisma.completion.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  for (const u of users) {
    await prisma.user.create({ data: u });
  }

  // Create habits with completions
  for (const h of habits) {
    await prisma.habit.create({
      data: h,
    });
  }
  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
