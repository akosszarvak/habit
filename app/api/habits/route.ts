import { NextResponse } from "next/server";
import prisma from "../../../lib/db";
import { getAuthenticatedUser } from "@/lib/utils/auth";

// Get /api/habits - List all habits for the authenticated user
export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      include: {
        completions: {
          orderBy: { date: "desc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ habits }, { status: 200 });
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json(
      { error: "Failed to fetch habits" },
      { status: 500 },
    );
  }
}

//POST /api/habits - create a habit
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Habit name is required" },
        { status: 400 },
      );
    }

    const habit = await prisma.habit.create({
      data: {
        name: name.trim(),
        userId: user.id,
      },
      include: {
        completions: true,
      },
    });

    return NextResponse.json({ habit }, { status: 201 });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json(
      { error: "Failed to create habit" },
      { status: 500 },
    );
  }
}
