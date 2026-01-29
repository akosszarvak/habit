"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";

type Completion = {
  id: string;
  date: Date;
  habitId: string;
};

type Habit = {
  id: string;
  name: string;
  createdAt: Date;
  completions: Completion[];
};

export default function HabitDashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch habits on mount
  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await fetch("/api/habits");
      const data = await res.json();
      setHabits(data.habits);
    } catch (error) {
      console.error("Failed to fetch habits:", error);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    setIsAdding(true);

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newHabitName }),
      });

      if (res.ok) {
        const data = await res.json();
        setHabits([data.habit, ...habits]);
        setNewHabitName("");
      }
    } catch (error) {
      console.error("Failed to add habit:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setHabits(habits.filter((habit) => habit.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete habit:", error);
    }
  };

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toISOString().split("T")[0];
    return habit.completions.some(
      (c) => new Date(c.date).toISOString().split("T")[0] === today,
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading habits...</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* add habit form */}
      <Card className="p-4">
        <form onSubmit={addHabit} className="flex gap-2">
          <Input
            type="text"
            placeholder="New habit name..."
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            className="flex-1"
            disabled={isAdding}
          />
          <Button type="submit" disabled={isAdding || !newHabitName.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Habit
          </Button>
        </form>
      </Card>

      {/* habbit list */}
      {habits.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            No habits yet. Create your first one above!
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => {
            const completedToday = isCompletedToday(habit);
            return (
              <Card>
                {habit.name}{" "}
                {completedToday ? "completed" : "not completed"}{" "}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
