import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { FocusMap, Goal, MoodMap, Task, TasksMap } from "@/types";
import { type ReactNode, createContext, useContext } from "react";

interface PlannerContextValue {
  tasks: TasksMap;
  setTasks: (v: TasksMap | ((p: TasksMap) => TasksMap)) => void;
  focus: FocusMap;
  setFocus: (v: FocusMap | ((p: FocusMap) => FocusMap)) => void;
  mood: MoodMap;
  setMood: (v: MoodMap | ((p: MoodMap) => MoodMap)) => void;
  dailyGoals: Goal[];
  setDailyGoals: (v: Goal[] | ((p: Goal[]) => Goal[])) => void;
  monthlyGoals: Goal[];
  setMonthlyGoals: (v: Goal[] | ((p: Goal[]) => Goal[])) => void;

  // Task helpers
  addTask: (dateKey: string, text: string) => void;
  toggleTask: (dateKey: string, taskId: string) => void;
  deleteTask: (dateKey: string, taskId: string) => void;

  // Focus helper
  setFocusForDay: (dateKey: string, text: string) => void;

  // Mood helper
  setMoodForDay: (dateKey: string, emoji: string) => void;
}

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<TasksMap>("serenity-tasks", {});
  const [focus, setFocus] = useLocalStorage<FocusMap>("serenity-focus", {});
  const [mood, setMood] = useLocalStorage<MoodMap>("serenity-mood", {});
  const [dailyGoals, setDailyGoals] = useLocalStorage<Goal[]>(
    "serenity-daily-goals",
    [
      {
        id: "dg1",
        text: "Drink 8 glasses of water",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "dg2",
        text: "Take a 20-minute walk",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "dg3",
        text: "Read for 30 minutes",
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ],
  );
  const [monthlyGoals, setMonthlyGoals] = useLocalStorage<Goal[]>(
    "serenity-monthly-goals",
    [
      {
        id: "mg1",
        text: "Complete a creative project",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "mg2",
        text: "Try one new recipe each week",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "mg3",
        text: "Finish the book on my nightstand",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "mg4",
        text: "Spend less time on social media",
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ],
  );

  function addTask(dateKey: string, text: string) {
    if (!text.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
    };
    setTasks((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] ?? []), newTask],
    }));
  }

  function toggleTask(dateKey: string, taskId: string) {
    setTasks((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] ?? []).map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      ),
    }));
  }

  function deleteTask(dateKey: string, taskId: string) {
    setTasks((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] ?? []).filter((t) => t.id !== taskId),
    }));
  }

  function setFocusForDay(dateKey: string, text: string) {
    setFocus((prev) => ({ ...prev, [dateKey]: text }));
  }

  function setMoodForDay(dateKey: string, emoji: string) {
    setMood((prev) => ({ ...prev, [dateKey]: emoji }));
  }

  return (
    <PlannerContext.Provider
      value={{
        tasks,
        setTasks,
        focus,
        setFocus,
        mood,
        setMood,
        dailyGoals,
        setDailyGoals,
        monthlyGoals,
        setMonthlyGoals,
        addTask,
        toggleTask,
        deleteTask,
        setFocusForDay,
        setMoodForDay,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used inside PlannerProvider");
  return ctx;
}
