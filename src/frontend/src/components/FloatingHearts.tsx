// Purely decorative ambient hearts on the page background
const HEARTS = [
  {
    symbol: "♡",
    top: "12%",
    left: "4%",
    right: undefined,
    delay: "0s",
    duration: "7s",
    size: "18px",
    opacity: 0.13,
  },
  {
    symbol: "✦",
    top: "28%",
    left: undefined,
    right: "3%",
    delay: "2.1s",
    duration: "8.5s",
    size: "14px",
    opacity: 0.11,
  },
  {
    symbol: "♡",
    top: "55%",
    left: "2%",
    right: undefined,
    delay: "1.3s",
    duration: "6.8s",
    size: "16px",
    opacity: 0.12,
  },
  {
    symbol: "✦",
    top: "70%",
    left: undefined,
    right: "4%",
    delay: "3.5s",
    duration: "9s",
    size: "12px",
    opacity: 0.1,
  },
  {
    symbol: "♡",
    top: "85%",
    left: "6%",
    right: undefined,
    delay: "0.7s",
    duration: "7.5s",
    size: "15px",
    opacity: 0.13,
  },
] as const;

export function FloatingHearts() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {HEARTS.map((h) => (
        <span
          key={`${h.symbol}-${h.top}-${h.delay}`}
          className="absolute select-none floating-heart"
          style={{
            top: h.top,
            left: h.left,
            right: h.right,
            fontSize: h.size,
            color: "#D9B1A8",
            opacity: h.opacity,
            animationDelay: h.delay,
            animationDuration: h.duration,
          }}
        >
          {h.symbol}
        </span>
      ))}
    </div>
  );
}
