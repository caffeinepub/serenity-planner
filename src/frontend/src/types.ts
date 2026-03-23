export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export type MoodEmoji = "😔" | "😐" | "🙂" | "😊" | "🌟";

export type NavTab = "weekly" | "daily" | "goals" | "mood";

export type TasksMap = Record<string, Task[]>;
export type FocusMap = Record<string, string>;
export type MoodMap = Record<string, string>;
