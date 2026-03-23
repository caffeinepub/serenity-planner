import { COMFORT_MESSAGES, getRandom } from "@/messages";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function ComfortButton() {
  const [open, setOpen] = useState(false);
  const [message] = useState(() => getRandom(COMFORT_MESSAGES));
  const [currentMsg, setCurrentMsg] = useState(message);

  function handleOpen() {
    setCurrentMsg(getRandom(COMFORT_MESSAGES));
    setOpen(true);
  }

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className="fixed bottom-6 right-4 sm:right-6 z-30 px-4 py-2 rounded-full font-serif italic text-sm text-foreground/70 bloom-comfort-btn transition-all duration-200 hover:scale-105"
        data-ocid="comfort.open_modal_button"
      >
        Feeling meh? 🥺
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="comfort-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/10 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="comfort-modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="fixed z-[60] inset-x-4 bottom-20 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[420px] comfort-modal rounded-3xl p-8 flex flex-col items-center text-center"
              data-ocid="comfort.modal"
            >
              <span className="text-4xl mb-4">🌸</span>
              <p className="font-serif italic text-xl leading-relaxed text-foreground/90 mb-6">
                {currentMsg}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-6 py-2.5 rounded-full bg-accent/30 hover:bg-accent/50 transition-colors font-medium text-sm text-foreground"
                data-ocid="comfort.close_button"
              >
                💗 I needed that
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
