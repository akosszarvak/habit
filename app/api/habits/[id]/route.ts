import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";
import { getAuthenticatedUser } from "@/lib/utils/auth";

// PUT /api/habits/[id] - Update habit name
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Habit name is required" },
        { status: 400 },
      );
    }

    // Verify habit exists & belongs to user
    const existingHabit = await prisma.habit.findUnique({
      where: { id },
    });

    if (!existingHabit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    if (existingHabit.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const habit = await prisma.habit.update({
      where: { id },
      data: { name: name.trim() },
      include: { completions: true },
    });
    return NextResponse.json({ habit }, { status: 200 });
  } catch (error) {
    console.error("Error updating habit:", error);
    return NextResponse.json(
      { error: "Failed to update habit" },
      { status: 500 },
    );
  }
}

// DELETE /api/habits/[id] - Delete habit
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify habit exists & belongs to user
    const existingHabit = await prisma.habit.findUnique({
      where: { id },
    });

    if (!existingHabit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    if (existingHabit.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Prisma will cascade delete completions due to relation
    await prisma.habit.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating habit:", error);
    return NextResponse.json(
      { error: "Failed to update habit" },
      { status: 500 },
    );
  }
}
