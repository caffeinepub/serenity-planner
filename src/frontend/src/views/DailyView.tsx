import { DailyDetailModal } from "@/components/DailyDetailModal";
import { usePlanner } from "@/context/PlannerContext";
import { getDailyQuote } from "@/data/quotes";
import {
  DAY_NAMES,
  DAY_NAMES_FULL,
  getWeekDays,
  isToday,
  toDateKey,
} from "@/utils/dateUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function DailyView() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const { tasks, mood, focus } = usePlanner();
  const weekDays = getWeekDays(weekOffset);
  const todayKey = toDateKey(new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-3xl font-bold text-foreground">
          Daily View
        </h2>
        <div className="flex items-center gap-1 bg-card rounded-full border border-border p-1 bloom-shadow">
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o - 1)}
            className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
            data-ocid="daily.pagination_prev"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset(0)}
            className="text-xs px-3 font-medium text-foreground hover:text-accent transition-colors"
            data-ocid="daily.today.button"
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o + 1)}
            className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
            data-ocid="daily.pagination_next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {weekDays.map((date, i) => {
          const dk = toDateKey(date);
          const dayTasks = tasks[dk] ?? [];
          const completed = dayTasks.filter((t) => t.completed).length;
          const dayMood = mood[dk];
          const dayFocus = focus[dk];
          const isCurrentDay = isToday(date);
          const quote = getDailyQuote(dk);

          return (
            <motion.div
              key={dk}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedDay(dk)}
              className={`bg-card rounded-2xl border p-5 bloom-shadow card-hover cursor-pointer
                ${isCurrentDay ? "border-accent ring-1 ring-accent/40" : "border-border"}`}
              data-ocid={`daily.item.${i + 1}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[48px]">
                    <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                      {DAY_NAMES[i]}
                    </p>
                    <p className="font-serif text-3xl font-bold text-foreground leading-none">
                      {date.getDate()}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">
                      {DAY_NAMES_FULL[i]}
                    </p>
                    {dayFocus ? (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {dayFocus}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-0.5 italic">
                        No focus set — tap to add
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {dayMood && <span className="text-xl">{dayMood}</span>}
                  {isCurrentDay && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      {completed}/{dayTasks.length} done
                    </span>
                  )}
                </div>
              </div>

              {dayTasks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-1.5">
                  {dayTasks.slice(0, 5).map((task) => (
                    <span
                      key={task.id}
                      className={`text-[11px] px-2 py-0.5 rounded-full border
                        ${
                          task.completed
                            ? "border-accent/30 bg-accent/10 text-accent line-through opacity-60"
                            : "border-border bg-secondary/50 text-foreground"
                        }`}
                    >
                      {task.text}
                    </span>
                  ))}
                  {dayTasks.length > 5 && (
                    <span className="text-[11px] text-muted-foreground">
                      +{dayTasks.length - 5} more
                    </span>
                  )}
                </div>
              )}

              {dk === todayKey && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs italic text-muted-foreground">
                    "{quote}"
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <DailyDetailModal
        dateKey={selectedDay}
        onClose={() => setSelectedDay(null)}
      />
    </motion.div>
  );
}
