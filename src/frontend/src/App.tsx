import { ComfortButton } from "@/components/ComfortModal";
import { FloatingHearts } from "@/components/FloatingHearts";
import { GreetingBanner } from "@/components/GreetingBanner";
import { Toaster } from "@/components/ui/sonner";
import { PlannerProvider } from "@/context/PlannerContext";
import { ToastProvider } from "@/context/ToastContext";
import type { NavTab } from "@/types";
import { DailyView } from "@/views/DailyView";
import { GoalsView } from "@/views/GoalsView";
import { MoodView } from "@/views/MoodView";
import { WeeklyView } from "@/views/WeeklyView";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const NAV_TABS: { id: NavTab; label: string; emoji: string }[] = [
  { id: "weekly", label: "Weekly", emoji: "📅" },
  { id: "daily", label: "Daily", emoji: "☀️" },
  { id: "goals", label: "Goals", emoji: "🎯" },
  { id: "mood", label: "Mood", emoji: "✨" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("weekly");

  return (
    <ToastProvider>
      <PlannerProvider>
        {/* Ambient floating hearts — behind everything */}
        <FloatingHearts />

        <div className="relative z-10 min-h-screen bloom-bg">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
              <h1 className="font-serif text-2xl font-bold text-foreground tracking-tight flex-shrink-0">
                Bloom.
              </h1>

              <nav
                className="flex items-center gap-1 bg-card rounded-full border border-border p-1 bloom-shadow overflow-x-auto"
                aria-label="Main navigation"
              >
                {NAV_TABS.map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                      ${
                        activeTab === tab.id
                          ? "bg-accent text-accent-foreground shadow-warm"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    data-ocid={`nav.${tab.id}.tab`}
                  >
                    <span className="hidden sm:inline text-base">
                      {tab.emoji}
                    </span>
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-sm font-medium text-foreground"
                  title="Your profile"
                >
                  🌸
                </div>
              </div>
            </div>

            {/* Greeting banner sits inside header area */}
            <GreetingBanner />
          </header>

          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24">
            <AnimatePresence mode="wait">
              {activeTab === "weekly" && (
                <motion.div
                  key="weekly"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <WeeklyView />
                </motion.div>
              )}
              {activeTab === "daily" && (
                <motion.div
                  key="daily"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <DailyView />
                </motion.div>
              )}
              {activeTab === "goals" && (
                <motion.div
                  key="goals"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <GoalsView />
                </motion.div>
              )}
              {activeTab === "mood" && (
                <motion.div
                  key="mood"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <MoodView />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <footer className="border-t border-border py-8 mt-4">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-2">
              <p className="font-serif italic text-sm text-muted-foreground">
                Made with love, just for you ❤️
              </p>
              <p className="text-xs text-muted-foreground/60">
                © {new Date().getFullYear()}. Built with{" "}
                <span className="text-accent">♥</span> using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </footer>
        </div>

        {/* Comfort mode button — fixed */}
        <ComfortButton />

        <Toaster />
      </PlannerProvider>
    </ToastProvider>
  );
}
