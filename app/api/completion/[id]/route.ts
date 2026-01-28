import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";
import { getAuthenticatedUser } from "@/lib/utils/auth";

// POST /api/habits/[id]/complete - Toggle completion for a specific date
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id: habitId } = await params;
    const body = await request.json();

    // Allow custom date or default to today
    const dateString = body.date || new Date().toISOString().split("T")[0];
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0); // Normalize to midnight

    // Verify habit exists & belongs to user
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    if (habit.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if completion already exists
    const existingCompletion = await prisma.completion.findUnique({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
    });

    if (existingCompletion) {
      // Toggle off - delete completion
      await prisma.completion.delete({
        where: { id: existingCompletion.id },
      });

      return NextResponse.json({ completed: false });
    } else {
      // Toggle on - create completion
      const completion = await prisma.completion.create({
        data: {
          habitId,
          date,
        },
      });

      return NextResponse.json({ completed: true, completion });
    }
  } catch (error) {
    console.error("Error toggling completion:", error);
    return NextResponse.json(
      { error: "Failed to toggle completion" },
      { status: 500 },
    );
  }
}
