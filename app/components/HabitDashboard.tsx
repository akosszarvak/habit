"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { isToday, isYesterday, format } from "date-fns";

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
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const toggleCompletion = async (habitId: string) => {
    try {
      const dateString = selectedDate.toISOString().split("T")[0];

      const res = await fetch(`/api/completion/${habitId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateString }),
      });
      if (res.ok) {
        const data = await res.json();

        setHabits(
          habits.map((habit) => {
            if (habit.id !== habitId) return habit;

            if (data.completed) {
              // Add completion
              return {
                ...habit,
                completions: [
                  ...habit.completions,
                  {
                    id: data.completion.id,
                    date: new Date(dateString),
                    habitId,
                  },
                ],
              };
            } else {
              // Remove completion
              return {
                ...habit,
                completions: habit.completions.filter(
                  (c) =>
                    new Date(c.date).toISOString().split("T")[0] !== dateString,
                ),
              };
            }
          }),
        );
      }
    } catch (error) {
      console.error("Failed to toggle completion:", error);
    }
  };

  const isCompletedToday = (habit: Habit, date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return habit.completions.some(
      (c) => new Date(c.date).toISOString().split("T")[0] === dateString,
    );
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };
  const formatDate = (date: Date) => {
    if (isToday()) return "Today";
    if (isYesterday(date)) return "Yesterday";

    return format(date, "EEE, MMM d");
  };

  const isToday = () => {
    const today = new Date().toISOString().split("T")[0];
    const selected = selectedDate.toISOString().split("T")[0];
    return today === selected;
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
      {/* date selector */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousDay}
            className="hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-900">
              {formatDate(selectedDate)}
            </span>
            {!isToday() && (
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextDay}
            className="hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </Card>
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
            const completedOnSelectedDate = isCompletedToday(
              habit,
              selectedDate,
            );

            return (
              <Card
                key={habit.id}
                className={`p-4 transition-all ${
                  completedOnSelectedDate ? "bg-green-50 border-green-200" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleCompletion(habit.id)}
                      className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                    >
                      {completedOnSelectedDate ? (
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      ) : (
                        <Circle className="w-8 h-8 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <span
                      className={`text-lg ${
                        completedOnSelectedDate
                          ? "text-green-900 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {habit.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHabit(habit.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
