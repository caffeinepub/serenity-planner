import { DailyDetailModal } from "@/components/DailyDetailModal";
import { DayCard } from "@/components/DayCard";
import { formatWeekRange, getWeekDays } from "@/utils/dateUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function WeeklyView() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const weekDays = getWeekDays(weekOffset);
  const weekRange = formatWeekRange(weekDays);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Weekly Planner
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">{weekRange}</p>
        </div>
        <div className="flex items-center gap-2">
          {weekOffset !== 0 && (
            <button
              type="button"
              onClick={() => setWeekOffset(0)}
              className="text-xs px-3 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-bloom-blush-dark transition-colors font-medium"
              data-ocid="weekly.today.button"
            >
              Today
            </button>
          )}
          <div className="flex items-center gap-1 bg-card rounded-full border border-border p-1 bloom-shadow">
            <button
              type="button"
              onClick={() => setWeekOffset((o) => o - 1)}
              className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
              aria-label="Previous week"
              data-ocid="weekly.pagination_prev"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-medium text-foreground px-1 min-w-[60px] text-center">
              {weekOffset === 0
                ? "This week"
                : weekOffset === 1
                  ? "Next week"
                  : weekOffset === -1
                    ? "Last week"
                    : `${weekOffset > 0 ? "+" : ""}${weekOffset}w`}
            </span>
            <button
              type="button"
              onClick={() => setWeekOffset((o) => o + 1)}
              className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
              aria-label="Next week"
              data-ocid="weekly.pagination_next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {weekDays.map((date, i) => (
          <DayCard
            key={date.toISOString()}
            date={date}
            dayIndex={i}
            onOpenDetail={setSelectedDay}
          />
        ))}
      </div>

      <DailyDetailModal
        dateKey={selectedDay}
        onClose={() => setSelectedDay(null)}
      />
    </motion.div>
  );
}
