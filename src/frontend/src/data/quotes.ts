export const MOTIVATIONAL_QUOTES = [
  "Small steps every day.",
  "You are doing better than you think.",
  "Progress, not perfection.",
  "Every day is a fresh start.",
  "Be gentle with yourself.",
  "Rest is part of the process.",
  "You deserve the life you imagine.",
  "One thing at a time.",
  "Done is better than perfect.",
  "Your best is always enough.",
];

export function getDailyQuote(dateKey: string): string {
  // Deterministic rotation by date
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) % MOTIVATIONAL_QUOTES.length;
  }
  return MOTIVATIONAL_QUOTES[hash];
}
