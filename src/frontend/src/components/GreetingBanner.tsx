import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getDailyGreeting } from "@/messages";
import { toDateKey } from "@/utils/dateUtils";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export function GreetingBanner() {
  const todayKey = toDateKey(new Date());
  const dismissKey = `bloom-greeting-dismissed-${todayKey}`;
  const [dismissed, setDismissed] = useLocalStorage<boolean>(dismissKey, false);
  const greeting = getDailyGreeting();

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="greeting-banner"
        >
          <span className="text-xs mr-1.5 opacity-70">💗</span>
          <p className="font-serif italic text-sm text-foreground/80 flex-1">
            {greeting}
          </p>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="ml-3 opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
            aria-label="Dismiss greeting"
            data-ocid="greeting.close_button"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
