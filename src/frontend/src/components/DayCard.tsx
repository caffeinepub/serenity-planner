import { HeartPop } from "@/components/HeartPop";
import { usePlanner } from "@/context/PlannerContext";
import { useToast } from "@/context/ToastContext";
import { TASK_COMPLETE_MESSAGES, getRandom } from "@/messages";
import { DAY_NAMES, isToday, toDateKey } from "@/utils/dateUtils";
import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface DayCardProps {
  date: Date;
  dayIndex: number;
  onOpenDetail: (dateKey: string) => void;
}

function stopProp(e: React.SyntheticEvent) {
  e.stopPropagation();
}

export function DayCard({ date, dayIndex, onOpenDetail }: DayCardProps) {
  const dateKey = toDateKey(date);
  const { tasks, mood, addTask, toggleTask, deleteTask } = usePlanner();
  const { showToast } = useToast();
  const dayTasks = tasks[dateKey] ?? [];
  const dayMood = mood[dateKey];
  const today = isToday(date);

  const [inputVal, setInputVal] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [heartTaskId, setHeartTaskId] = useState<string | null>(null);

  function handleAdd() {
    if (inputVal.trim()) {
      addTask(dateKey, inputVal);
      setInputVal("");
      setShowInput(false);
    }
  }

  function handleToggle(taskId: string) {
    const task = dayTasks.find((t) => t.id === taskId);
    toggleTask(dateKey, taskId);
    // Only pop + toast when completing (not un-completing)
    if (task && !task.completed) {
      setHeartTaskId(taskId);
      showToast(getRandom(TASK_COMPLETE_MESSAGES));
      setTimeout(() => setHeartTaskId(null), 800);
    }
  }

  return (
    <motion.div
      layout
      className={`relative flex flex-col bg-card rounded-2xl border border-border p-4 bloom-shadow card-hover cursor-pointer select-none
        ${today ? "ring-2 ring-accent" : ""}`}
      onClick={() => onOpenDetail(dateKey)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
            {DAY_NAMES[dayIndex]}
          </p>
          <p className="font-serif text-2xl font-bold text-foreground leading-none">
            {date.getDate()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {today && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
              Today
            </span>
          )}
          {dayMood && <span className="text-lg">{dayMood}</span>}
        </div>
      </div>

      <div
        className="flex-1 space-y-1.5 min-h-[48px]"
        onClick={stopProp}
        onKeyDown={stopProp}
      >
        <AnimatePresence initial={false}>
          {dayTasks.slice(0, 4).map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 group"
            >
              <span className="relative flex-shrink-0">
                <HeartPop show={heartTaskId === task.id} />
                <button
                  type="button"
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300
                    ${task.completed ? "bg-accent border-accent" : "border-border bg-transparent hover:border-accent"}`}
                  onClick={() => handleToggle(task.id)}
                  aria-label={
                    task.completed ? "Mark incomplete" : "Mark complete"
                  }
                />
              </span>
              <span
                className={`text-xs flex-1 transition-all duration-300
                  ${task.completed ? "line-through text-muted-foreground opacity-50" : "text-foreground"}`}
              >
                {task.text}
              </span>
              <button
                type="button"
                onClick={() => deleteTask(dateKey, task.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                aria-label="Delete task"
              >
                <X size={10} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {dayTasks.length > 4 && (
          <p className="text-[10px] text-muted-foreground">
            +{dayTasks.length - 4} more
          </p>
        )}
        {dayTasks.length === 0 && (
          <p className="text-[10px] text-muted-foreground italic">
            No tasks yet
          </p>
        )}
      </div>

      <div className="mt-3" onClick={stopProp} onKeyDown={stopProp}>
        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex gap-1 mb-2"
            >
              <input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") handleAdd();
                  if (e.key === "Escape") setShowInput(false);
                }}
                placeholder="Add task…"
                className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={handleAdd}
                className="text-xs px-2 py-1 rounded-lg bg-accent text-accent-foreground hover:bg-bloom-blush-dark transition-colors"
              >
                Add
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setShowInput(!showInput)}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-accent transition-colors"
        >
          <Plus size={11} />
          <span>Add task</span>
        </button>
      </div>
    </motion.div>
  );
}
