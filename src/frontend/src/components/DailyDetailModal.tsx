import { HeartPop } from "@/components/HeartPop";
import { usePlanner } from "@/context/PlannerContext";
import { useToast } from "@/context/ToastContext";
import { getDailyQuote } from "@/data/quotes";
import {
  MOTIVATION_MESSAGES,
  TASK_COMPLETE_MESSAGES,
  getRandom,
} from "@/messages";
import type { MoodEmoji } from "@/types";
import { formatDateKey } from "@/utils/dateUtils";
import { Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const MOODS: MoodEmoji[] = ["😔", "😐", "🙂", "😊", "🌟"];
const MOOD_LABELS: Record<string, string> = {
  "😔": "Not great",
  "😐": "Okay",
  "🙂": "Good",
  "😊": "Happy",
  "🌟": "Amazing",
};

function MOOD_OCID(m: string): string {
  if (m === "😔") return "sad";
  if (m === "😐") return "neutral";
  if (m === "🙂") return "good";
  if (m === "😊") return "happy";
  return "amazing";
}

interface ModalContentProps {
  dateKey: string;
  onClose: () => void;
}

function ModalContent({ dateKey, onClose }: ModalContentProps) {
  const {
    tasks,
    focus,
    mood,
    addTask,
    toggleTask,
    deleteTask,
    setFocusForDay,
    setMoodForDay,
  } = usePlanner();
  const { showToast } = useToast();

  const [newTask, setNewTask] = useState("");
  const [focusText, setFocusText] = useState(focus[dateKey] ?? "");
  const [heartTaskId, setHeartTaskId] = useState<string | null>(null);

  const dayTasks = tasks[dateKey] ?? [];
  const dayMood = mood[dateKey];
  const quote = getDailyQuote(dateKey);

  function handleAddTask() {
    if (newTask.trim()) {
      addTask(dateKey, newTask);
      setNewTask("");
    }
  }

  function handleToggle(taskId: string) {
    const task = dayTasks.find((t) => t.id === taskId);
    toggleTask(dateKey, taskId);
    if (task && !task.completed) {
      setHeartTaskId(taskId);
      showToast(getRandom(TASK_COMPLETE_MESSAGES));
      setTimeout(() => setHeartTaskId(null), 800);
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            {formatDateKey(dateKey)}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground italic flex-1">
              {quote}
            </p>
            <button
              type="button"
              onClick={() => showToast(getRandom(MOTIVATION_MESSAGES))}
              className="text-base hover:scale-125 transition-transform flex-shrink-0"
              title="Send yourself some love"
              aria-label="Send love"
              data-ocid="daily_detail.toggle"
            >
              💗
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-3 p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground flex-shrink-0"
          data-ocid="daily_detail.close_button"
        >
          <X size={18} />
        </button>
      </div>

      {/* Mood Picker */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          How are you feeling?
        </h3>
        <div className="flex gap-3">
          {MOODS.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMoodForDay(dateKey, m)}
              title={MOOD_LABELS[m]}
              className={`text-2xl w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200
                ${
                  dayMood === m
                    ? "bg-accent/30 ring-2 ring-accent scale-110"
                    : "hover:bg-secondary hover:scale-105"
                }`}
              data-ocid={`daily_detail.mood_${MOOD_OCID(m)}.button`}
            >
              {m}
            </button>
          ))}
        </div>
        {dayMood && (
          <p className="text-xs text-muted-foreground mt-2">
            Today&apos;s mood:{" "}
            <span className="font-medium text-foreground">
              {MOOD_LABELS[dayMood]}
            </span>
          </p>
        )}
      </section>

      {/* Today's Focus */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Today&apos;s Focus
        </h3>
        <textarea
          value={focusText}
          onChange={(e) => setFocusText(e.target.value)}
          onBlur={() => setFocusForDay(dateKey, focusText)}
          placeholder="What's your main intention for today?"
          rows={3}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none transition-shadow"
          data-ocid="daily_detail.textarea"
        />
      </section>

      {/* Tasks */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Tasks
        </h3>
        <div className="space-y-2 mb-3" data-ocid="daily_detail.list">
          <AnimatePresence initial={false}>
            {dayTasks.map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 group p-2.5 rounded-xl hover:bg-secondary/50 transition-colors"
                data-ocid={`daily_detail.item.${idx + 1}`}
              >
                <span className="relative flex-shrink-0">
                  <HeartPop show={heartTaskId === task.id} />
                  <button
                    type="button"
                    onClick={() => handleToggle(task.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
                      ${task.completed ? "bg-accent border-accent" : "border-border hover:border-accent"}`}
                    aria-label={
                      task.completed ? "Mark incomplete" : "Mark complete"
                    }
                    data-ocid={`daily_detail.checkbox.${idx + 1}`}
                  >
                    {task.completed && (
                      <svg
                        className="w-2.5 h-2.5 text-accent-foreground"
                        viewBox="0 0 10 8"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 4l3 3 5-6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </span>
                <span
                  className={`flex-1 text-sm transition-all duration-300
                    ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {task.text}
                </span>
                <button
                  type="button"
                  onClick={() => deleteTask(dateKey, task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
                  aria-label="Delete task"
                  data-ocid={`daily_detail.delete_button.${idx + 1}`}
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {dayTasks.length === 0 && (
            <p
              className="text-sm text-muted-foreground italic py-2"
              data-ocid="daily_detail.empty_state"
            >
              No tasks yet — add one below.
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            placeholder="Add a new task…"
            className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-muted-foreground"
            data-ocid="daily_detail.input"
          />
          <button
            type="button"
            onClick={handleAddTask}
            className="px-4 py-2.5 rounded-full bg-accent text-accent-foreground hover:bg-bloom-blush-dark text-sm font-medium transition-colors flex items-center gap-1"
            data-ocid="daily_detail.submit_button"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </section>
    </div>
  );
}

interface DailyDetailModalProps {
  dateKey: string | null;
  onClose: () => void;
}

export function DailyDetailModal({ dateKey, onClose }: DailyDetailModalProps) {
  return (
    <AnimatePresence>
      {dateKey && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="fixed inset-x-4 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[560px] md:max-h-[80vh] bg-card rounded-t-3xl md:rounded-3xl shadow-warm-lg z-50 overflow-y-auto"
            data-ocid="daily_detail.modal"
          >
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>
            <ModalContent key={dateKey} dateKey={dateKey} onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
