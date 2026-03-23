import { AnimatePresence, motion } from "motion/react";

interface HeartPopProps {
  show: boolean;
}

export function HeartPop({ show }: HeartPopProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          key="heart"
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.3, 1.1, 0], y: -28 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute -top-1 left-1/2 -translate-x-1/2 text-base pointer-events-none select-none z-10"
          aria-hidden="true"
        >
          💖
        </motion.span>
      )}
    </AnimatePresence>
  );
}
