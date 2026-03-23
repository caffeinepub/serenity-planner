import { usePlanner } from "@/context/PlannerContext";
import type { MoodEmoji } from "@/types";
import {
  DAY_NAMES_FULL,
  getWeekDays,
  isToday,
  toDateKey,
} from "@/utils/dateUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const MOODS: MoodEmoji[] = ["😔", "😐", "🙂", "😊", "🌟"];
const MOOD_LABELS: Record<string, string> = {
  "😔": "Not great",
  "😐": "Okay",
  "🙂": "Good",
  "😊": "Happy",
  "🌟": "Amazing",
};
const MOOD_COLORS: Record<string, string> = {
  "😔": "bg-blue-100 border-blue-200",
  "😐": "bg-secondary border-border",
  "🙂": "bg-green-50 border-green-200",
  "😊": "bg-accent/10 border-accent/30",
  "🌟": "bg-yellow-50 border-yellow-200",
};

export function MoodView() {
  const [weekOffset, setWeekOffset] = useState(0);
  const { mood, setMoodForDay, focus, setFocusForDay } = usePlanner();
  const weekDays = getWeekDays(weekOffset);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const weekMoods = weekDays.map((d) => mood[toDateKey(d)]);
  const filledCount = weekMoods.filter(Boolean).length;

  function moodSummary(): string {
    if (filledCount === 0) return "No moods logged this week yet.";
    const counts: Record<string, number> = {};
    for (const m of weekMoods) {
      if (m) counts[m] = (counts[m] ?? 0) + 1;
    }
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return `Your most common mood this week: ${top[0]} ${MOOD_LABELS[top[0]]}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-3xl font-bold text-foreground">
          Mood Tracker
        </h2>
        <div className="flex items-center gap-1 bg-card rounded-full border border-border p-1 bloom-shadow">
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o - 1)}
            className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
            data-ocid="mood.pagination_prev"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset(0)}
            className="text-xs px-3 font-medium text-foreground hover:text-accent transition-colors"
            data-ocid="mood.today.button"
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset((o) => o + 1)}
            className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
            data-ocid="mood.pagination_next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Summary card */}
      <div
        className="bg-card rounded-2xl border border-border p-5 bloom-shadow mb-6"
        data-ocid="mood.card"
      >
        <p className="text-sm font-medium text-foreground">{moodSummary()}</p>
        <div className="flex gap-1 mt-3">
          {weekDays.map((d) => {
            const dk = toDateKey(d);
            const dayMoodVal = mood[dk];
            return (
              <div
                key={dk}
                className={`flex-1 h-8 rounded-lg flex items-center justify-center text-base
                  ${dayMoodVal ? (MOOD_COLORS[dayMoodVal] ?? "bg-secondary border-border") : "bg-secondary border-border"} border`}
              >
                {dayMoodVal ?? "·"}
              </div>
            );
          })}
        </div>
        <div className="flex mt-1">
          {DAY_NAMES_FULL.map((name) => (
            <p
              key={name}
              className="flex-1 text-center text-[10px] text-muted-foreground"
            >
              {name.slice(0, 1)}
            </p>
          ))}
        </div>
      </div>

      {/* Day cards */}
      <div className="space-y-3">
        {weekDays.map((date, i) => {
          const dk = toDateKey(date);
          const dayMood = mood[dk];
          const dayFocus = focus[dk];
          const isEditing = editingNote === dk;
          const today = isToday(date);

          return (
            <motion.div
              key={dk}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-card rounded-2xl border p-5 bloom-shadow
                ${today ? "border-accent ring-1 ring-accent/40" : "border-border"}`}
              data-ocid={`mood.item.${i + 1}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-center min-w-[40px]">
                  <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                    {DAY_NAMES_FULL[i].slice(0, 3)}
                  </p>
                  <p className="font-serif text-2xl font-bold text-foreground">
                    {date.getDate()}
                  </p>
                  {today && (
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex gap-2 mb-3">
                    {MOODS.map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setMoodForDay(dk, m)}
                        className={`text-xl w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200
                          ${
                            dayMood === m
                              ? "bg-accent/20 ring-2 ring-accent scale-110"
                              : "hover:bg-secondary hover:scale-105"
                          }`}
                        title={MOOD_LABELS[m]}
                        data-ocid={`mood.item.${i + 1}.toggle`}
                      >
                        {m}
                      </button>
                    ))}
                    {dayMood && (
                      <span className="text-xs self-center text-muted-foreground ml-1">
                        {MOOD_LABELS[dayMood]}
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      onBlur={() => {
                        setFocusForDay(dk, noteText);
                        setEditingNote(null);
                      }}
                      placeholder="How was your day? Any reflections…"
                      rows={3}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                      data-ocid={`mood.item.${i + 1}.textarea`}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNote(dk);
                        setNoteText(dayFocus ?? "");
                      }}
                      className="w-full text-left text-sm rounded-xl border border-dashed border-border px-3 py-2 text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
                      data-ocid={`mood.item.${i + 1}.button`}
                    >
                      {dayFocus ? (
                        <span className="text-foreground">{dayFocus}</span>
                      ) : (
                        <span className="italic">Add a reflection…</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
