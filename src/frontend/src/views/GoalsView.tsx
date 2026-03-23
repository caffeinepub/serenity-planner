import { usePlanner } from "@/context/PlannerContext";
import type { Goal } from "@/types";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

function GoalSection({
  title,
  emoji,
  goals,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
  ocidPrefix,
}: {
  title: string;
  emoji: string;
  goals: Goal[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  ocidPrefix: string;
}) {
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  function handleAdd() {
    if (input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  }

  function startEdit(goal: Goal) {
    setEditingId(goal.id);
    setEditText(goal.text);
  }

  function saveEdit(id: string) {
    if (editText.trim()) onEdit(id, editText.trim());
    setEditingId(null);
  }

  const completed = goals.filter((g) => g.completed).length;
  const pct =
    goals.length > 0 ? Math.round((completed / goals.length) * 100) : 0;

  return (
    <div
      className="bg-card rounded-2xl border border-border p-6 bloom-shadow"
      data-ocid={`${ocidPrefix}.card`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-foreground">
            {emoji} {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completed} of {goals.length} completed
          </p>
        </div>
        {goals.length > 0 && (
          <div className="relative w-12 h-12">
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 36 36"
              aria-hidden="true"
            >
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="oklch(var(--border))"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="oklch(var(--accent))"
                strokeWidth="3"
                strokeDasharray={`${pct * 0.942} 94.2`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
              {pct}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4" data-ocid={`${ocidPrefix}.list`}>
        <AnimatePresence initial={false}>
          {goals.map((goal, idx) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 group transition-colors"
              data-ocid={`${ocidPrefix}.item.${idx + 1}`}
            >
              <button
                type="button"
                onClick={() => onToggle(goal.id)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300
                  ${goal.completed ? "bg-accent border-accent" : "border-border hover:border-accent"}`}
                aria-label={
                  goal.completed ? "Mark incomplete" : "Mark complete"
                }
                data-ocid={`${ocidPrefix}.checkbox.${idx + 1}`}
              >
                {goal.completed && (
                  <Check
                    size={10}
                    strokeWidth={3}
                    className="text-accent-foreground"
                  />
                )}
              </button>

              {editingId === goal.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => saveEdit(goal.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(goal.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="flex-1 text-sm bg-background border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              ) : (
                <span
                  className={`flex-1 text-sm transition-all duration-300
                    ${goal.completed ? "line-through text-muted-foreground opacity-60" : "text-foreground"}`}
                >
                  {goal.text}
                </span>
              )}

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => startEdit(goal)}
                  className="p-1 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
                  aria-label="Edit goal"
                  data-ocid={`${ocidPrefix}.edit_button.${idx + 1}`}
                >
                  <Pencil size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(goal.id)}
                  className="p-1 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                  aria-label="Delete goal"
                  data-ocid={`${ocidPrefix}.delete_button.${idx + 1}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {goals.length === 0 && (
          <p
            className="text-sm text-muted-foreground italic py-2"
            data-ocid={`${ocidPrefix}.empty_state`}
          >
            No goals yet — add your first one below.
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={`Add a ${title.toLowerCase()} goal…`}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-muted-foreground"
          data-ocid={`${ocidPrefix}.input`}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-full bg-accent text-accent-foreground hover:bg-bloom-blush-dark text-sm font-medium transition-colors flex items-center gap-1"
          data-ocid={`${ocidPrefix}.submit_button`}
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
}

export function GoalsView() {
  const { dailyGoals, setDailyGoals, monthlyGoals, setMonthlyGoals } =
    usePlanner();

  function makeGoal(text: string): Goal {
    return {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
  }

  function toggleGoal(goals: Goal[], id: string): Goal[] {
    return goals.map((g) =>
      g.id === id ? { ...g, completed: !g.completed } : g,
    );
  }

  function deleteGoal(goals: Goal[], id: string): Goal[] {
    return goals.filter((g) => g.id !== id);
  }

  function editGoal(goals: Goal[], id: string, text: string): Goal[] {
    return goals.map((g) => (g.id === id ? { ...g, text } : g));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
        Goals
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalSection
          title="Daily Goals"
          emoji="☀️"
          goals={dailyGoals}
          onAdd={(text) => setDailyGoals((prev) => [...prev, makeGoal(text)])}
          onToggle={(id) => setDailyGoals((prev) => toggleGoal(prev, id))}
          onDelete={(id) => setDailyGoals((prev) => deleteGoal(prev, id))}
          onEdit={(id, text) =>
            setDailyGoals((prev) => editGoal(prev, id, text))
          }
          ocidPrefix="daily_goals"
        />

        <GoalSection
          title="Monthly Goals"
          emoji="🌙"
          goals={monthlyGoals}
          onAdd={(text) => setMonthlyGoals((prev) => [...prev, makeGoal(text)])}
          onToggle={(id) => setMonthlyGoals((prev) => toggleGoal(prev, id))}
          onDelete={(id) => setMonthlyGoals((prev) => deleteGoal(prev, id))}
          onEdit={(id, text) =>
            setMonthlyGoals((prev) => editGoal(prev, id, text))
          }
          ocidPrefix="monthly_goals"
        />
      </div>
    </motion.div>
  );
}
